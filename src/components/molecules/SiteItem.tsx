// src/components/molecules/SiteItem.tsx
import React from 'react';
import Tag from '../atoms/Tag';
import CustomLink from '../atoms/CustomLink';
import StatusIcon from '../atoms/StatusIcon';
import { LinkTwo } from '@icon-park/react';
import Tooltip from 'antd/es/tooltip';
import 'antd/es/tooltip/style';
import StatusTooltip from './StatusTooltip';
import { formatDuration, formatDurationToMinute } from '../../utils/timeTools';
import { ProcessedData } from '../../model';

interface SiteItemProps {
	site: ProcessedData;
	onClick: () => void;
}

interface SiteTypeMap {
	[key: number]: {
		tag: string;
		text: string;
	};
}

const SiteItem: React.FC<SiteItemProps> = ({ site, onClick }) => {
	const days = import.meta.env.VITE_COUNT_DAYS || 60;
	const siteTypeMap: SiteTypeMap = {
		1: { tag: 'HTTP', text: '发送 HTTP(S) 请求获取目标服务可用性' },
		2: { tag: 'KEYWORD', text: '发送 HTTP(S) 请求并检查响应内容中是否包含指定关键词' },
		3: { tag: 'PING', text: '发送 ICMP Echo 请求获取目标服务可用性' },
		4: { tag: 'PORT', text: '检查目标服务端口是否开放' },
		5: { tag: 'HEARTBEAT', text: '由被监控的服务主动发送心跳包获知其可用性' },
	};

	return (
		<div
			className={`p-30px border-b-1 border-b-solid border-b-#e6e7e8 transition-background-color-300 first:rd-t-16px last:rd-b-16px
      ${site.status !== 'ok' ? 'bg-#ff00000f' : ''}
      hover:bg-#efefef cursor-pointer`}
			onClick={onClick}
		>
			<div className="flex items-center">
				<div>{site.name}</div>
				<Tooltip title={<span>{siteTypeMap[site.type]?.text}</span>} destroyTooltipOnHide>
					<Tag className="ml-8px text-9px opacity-90">
						{siteTypeMap[site.type]?.tag || '未知'}/
						{formatDurationToMinute(site.interval)}
					</Tag>
				</Tooltip>
				<CustomLink to={site.url} title={`访问 ${site.name}`}>
					<LinkTwo className="text-#a0a0a0 hover:text-primary transition-color-300" />
				</CustomLink>
				<div
					className={`flex items-center ml-auto text-14px ${site.status === 'ok' ? 'text-normal' : 'text-error'}`}
				>
					<StatusIcon
						color={site.status === 'ok' ? 'bg-normal' : 'bg-error'}
						afterColor={site.status === 'ok' ? 'bg-normal' : 'bg-error'}
						className="w-12px h-12px"
					/>
					<span className="hidden ml-8px sm:inline">
						{site.status === 'ok' ? '正常访问' : '无法访问'}
					</span>
				</div>
			</div>

			<div className="flex justify-between mt-15px mb-10px">
				{site.daily.map((data: any, index: number) => {
					const { uptime, down, date } = data;
					const time = date.format('YYYY-MM-DD');
					let status: 'normal' | 'error' | 'none' | null = null;
					if (uptime >= 100) status = 'normal';
					else if (uptime <= 0 && down.times === 0) status = 'none';
					else status = 'error';
					return (
						<Tooltip
							key={index}
							title={<StatusTooltip date={time} status={status} />}
							destroyTooltipOnHide
						>
							<div
								className={`h-26px flex-grow mx-1px 
                            ${
								{
									normal: 'bg-normal',
									error: 'bg-error',
									none: 'bg-#e5e8eb',
								}[status]
							}
							max-sm:m-0 max-sm:rounded-none
							max-sm:[&:first-child]:rounded-l-6px
							max-sm:[&:last-child]:rounded-r-6px
							max-sm:hover:transform-none
                            rounded-6px transition-transform-300ms hover:scale-y-105`}
							/>
						</Tooltip>
					);
				})}
			</div>

			<div className="flex justify-between text-secondary text-13px">
				<div className="hidden md:inline">今天</div>
				<div>
					{site.total.times
						? `最近 ${days} 天内故障 ${site.total.times} 次，累计 ${formatDuration(site.total.duration)}，平均可用率 ${site.average}%`
						: `最近 ${days} 天内可用率 ${site.average}%`}
				</div>
				<div className="hidden md:inline">
					{site.daily[site.daily.length - 1].date.format('YYYY-MM-DD')}
				</div>
			</div>
		</div>
	);
};

export default React.memo(SiteItem);
