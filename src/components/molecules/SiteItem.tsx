import React from 'react';
import Tag from '../atoms/Tag';
import CustomLink from '../atoms/CustomLink';
import StatusIcon from '../atoms/StatusIcon';
import Tooltip from 'antd/es/tooltip';
import 'antd/es/tooltip/style';
import StatusTooltip from './StatusTooltip';
import { formatDuration, formatDurationToMinute } from '../../utils/timeTools';
import { ProcessedData } from '../../model';
import { useI18n } from '../../hooks/useLocales';

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
	const { t } = useI18n();

	const days = import.meta.env.VITE_COUNT_DAYS || 60;
	const siteTypeMap: SiteTypeMap = {
		1: { tag: 'HTTP', text: t('card.type.HTTP') },
		2: { tag: 'KEYWORD', text: t('card.type.KEYWORD') },
		3: { tag: 'PING', text: t('card.type.PING') },
		4: { tag: 'PORT', text: t('card.type.PORT') },
		5: { tag: 'HEARTBEAT', text: t('card.type.HEARTBEAT') },
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
						{siteTypeMap[site.type]?.tag || t('common.unknown')}/
						{formatDurationToMinute(site.interval)}
					</Tag>
				</Tooltip>
				<CustomLink
					className="i-lucide-link-2"
					to={site.url}
					title={t('card.other.visit').replace('{name}', site.name)}
				>
					<></>
				</CustomLink>
				<div
					className={`flex items-center ml-auto text-14px ${site.status === 'ok' ? 'text-normal' : 'text-error'}`}
				>
					<StatusIcon
						color={site.status === 'ok' ? 'bg-normal' : 'bg-error'}
						afterColor={site.status === 'ok' ? 'bg-normal' : 'bg-error'}
						className="w-12px h-12px after:animate-duration-1s"
					/>
					<span className="hidden ml-8px sm:inline">
						{site.status === 'ok' ? t('card.status.normal') : t('card.status.error')}
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
							title={
								<StatusTooltip
									date={time}
									status={status}
									uptime={uptime}
									downTimes={down.times}
									duration={down.duration}
								/>
							}
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
				<div className="hidden md:inline">{t('common.time.today')}</div>
				<div>
					{site.total.times
						? t('card.summary.error')
								.replace('{days}', days)
								.replace('{times}', site.total.times)
								.replace('{duration}', formatDuration(site.total.duration))
								.replace('{percent}', site.average.toString())
						: t('card.summary.normal')
								.replace('{days}', days)
								.replace('{percent}', site.average.toString())}
				</div>
				<div className="hidden md:inline">
					{site.daily[site.daily.length - 1].date.format('YYYY-MM-DD')}
				</div>
			</div>
		</div>
	);
};

export default React.memo(SiteItem);
