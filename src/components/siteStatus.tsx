import { useState } from 'react';
import { SwitchTransition, CSSTransition } from 'react-transition-group';
import { formatNumber, formatDuration, formatDurationToMinute } from '../utils/timeTools';
import { LinkTwo } from '@icon-park/react';
import Tooltip from 'antd/es/tooltip';
import 'antd/es/tooltip/style';
import Button from 'antd/es/button';
import 'antd/es/button/style';
import Result from 'antd/es/result';
import 'antd/es/result/style';
import Modal from 'antd/es/modal';
import 'antd/es/modal/style';
import CustomLink from '../components/customLink';
import SiteCharts from '../components/siteCharts';
import { useStatusStore } from '../stores/status';
import Tag from './tag';

interface SiteTypeMap {
	[key: number]: {
		tag: string;
		text: string;
	};
}

const SiteStatus = ({ siteData, days }: { siteData: any; days: number }) => {
	const { siteState } = useStatusStore();
	const [siteDetailsShow, setSiteDetailsShow] = useState<boolean>(false);
	const [siteDetailsData, setSiteDetailsData] = useState<any>(null);

	const siteTypeMap: SiteTypeMap = {
		1: { tag: 'HTTP', text: '发送 HTTP(S) 请求获取目标服务可用性' },
		2: { tag: 'KEYWORD', text: '发送 HTTP(S) 请求并检查响应内容中是否包含指定关键词' },
		3: { tag: 'PING', text: '发送 ICMP Echo 请求获取目标服务可用性' },
		4: { tag: 'PORT', text: '检查目标服务端口是否开放' },
		5: { tag: 'HEARTBEAT', text: '由被监控的服务主动发送心跳包获知其可用性' },
	};

	// 开启弹窗
	const showSiteDetails = (data: any) => {
		setSiteDetailsShow(true);
		setSiteDetailsData(data);
	};

	// 关闭弹窗
	const closeSiteDetails = () => {
		setSiteDetailsShow(false);
		setSiteDetailsData(null);
	};

	return (
		<SwitchTransition mode="out-in">
			<CSSTransition key={siteState} classNames="fade" timeout={100}>
				{siteState !== 'wrong' ? (
					siteState !== 'loading' && siteData ? (
						<div className="w-full">
							{siteData.map((site: any) => (
								<div
									key={site.id}
									className={`p-30px border-b-1 border-b-solid border-b-#e6e7e8 transition-background-color-300ms
                    ${site.status !== 'ok' ? 'bg-#ff00000f' : ''}
                    hover:bg-#efefef cursor-pointer first:rd-t-16px last:rd-b-16px transition-background-color-300`}
									onClick={() => showSiteDetails(site)}
								>
									<div className="flex items-center">
										<div>{site.name}</div>
										<Tag className="ml-8px text-9px opacity-90">
											{siteTypeMap[site.type]?.tag || '未知'}/
											{formatDurationToMinute(site.interval)}
										</Tag>
										<CustomLink to={site.url} title={'访问 ' + site.name}>
											<LinkTwo className="text-#a0a0a0 hover:text-primary transition-color-300ms" />
										</CustomLink>
										<div
											className={`flex flex-row items-center m-l-auto text-14px ${site.status === 'ok' ? 'text-normal' : 'text-error'}`}
										>
											<div
												className={`w-12px h-12px rounded-full relative ${site.status === 'ok' ? 'bg-normal after:bg-normal' : 'bg-error after:bg-error'} after:content-empty after:absolute after:inset-0 after:rounded-full after:animate-breathing after:animate-duration-1s after:animate after:animate-iteration-infinite`}
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
											let status = null;
											let tooltipText = null;
											if (uptime >= 100) {
												status = 'normal';
												tooltipText = `可用率 ${formatNumber(uptime)}%`;
											} else if (uptime <= 0 && down.times === 0) {
												status = 'none';
												tooltipText = '无数据';
											} else {
												status = 'error';
												tooltipText = `故障 ${
													down.times
												} 次，累计 ${formatDuration(
													down.duration
												)}，可用率 ${formatNumber(uptime)}%`;
											}
											return (
												<Tooltip
													key={index}
													title={
														<div className="flex flex-col">
															<div className="text-16px opacity-70">
																{time}
															</div>
															<div>{tooltipText}</div>
														</div>
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
										<div className="hidden md:inline">今天</div>
										<div>
											{site.total.times
												? `最近 ${days} 天内故障 ${site.total.times} 次，累计 ${formatDuration(site.total.duration)}，平均可用率 ${site.average}%`
												: `最近 ${days} 天内可用率 ${site.average}%`}
										</div>
										<div className="hidden md:inline">
											{site.daily[site.daily.length - 1].date.format(
												'YYYY-MM-DD'
											)}
										</div>
									</div>
								</div>
							))}

							<Modal
								title={siteDetailsData?.name}
								open={siteDetailsShow}
								onCancel={closeSiteDetails}
								footer={null}
								className="ant-modal min-w-30rem max-w-960px w-68vw mt-20px"
							>
								<SiteCharts siteDetails={siteDetailsData} />
							</Modal>
						</div>
					) : (
						<div className="w-36px h-36px border-4 border-solid border-#ededed border-t-#858585 rounded-full animate-spin" />
					)
				) : (
					<Result
						status="error"
						title="出错啦, 待会再试试吧（；´д｀）ゞ"
						extra={
							<Button type="primary" danger onClick={() => location.reload()}>
								重试
							</Button>
						}
					/>
				)}
			</CSSTransition>
		</SwitchTransition>
	);
};

export default SiteStatus;
