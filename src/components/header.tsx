import { useState } from 'react';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import { Refresh } from '@icon-park/react';
import message from 'antd/es/message';
import 'antd/es/message/style';
import { useStatusStore } from '../stores/status';
import { useCacheStore } from '../stores/cache';
import { formatTimestamp } from '../utils/timeTools';

const Header = ({ getSiteData }: { getSiteData: () => void }) => {
	const [messageApi, contextHolder] = message.useMessage();
	const [lastClickTime, setLastClickTime] = useState(0);
	const { siteState, siteOverview } = useStatusStore();
	const { siteData, changeSiteData } = useCacheStore();

	// 加载配置
	const siteName = import.meta.env.VITE_SITE_NAME;

	// 状态文本
	const statusNames: Record<string, string> = {
		loading: '站点状态加载中',
		error: '部分站点出现异常',
		allError: '全部站点出现异常',
		normal: '所有站点运行正常',
		wrong: '数据请求失败',
	};

	const gradientColors = {
		loading: '#00bbff, #0088ff',
		error: '#e47e7e, #ee5555',
		allError: '#ee5555, #ff2b2b',
		wrong: '#ee5555, #ff2b2b',
		normal: '#4fd69c, #24a66e',
	};

	// 刷新状态
	const refreshStatus = () => {
		const currentTime = Date.now();
		if (currentTime - lastClickTime < 60000) {
			messageApi.open({
				key: 'updata',
				type: 'warning',
				content: '请稍后再尝试刷新',
			});
			return false;
		}
		changeSiteData(null);
		getSiteData();
		setLastClickTime(currentTime);
	};

	return (
		<header
			id="header"
			className={`relative z-0 text-white box-border ${siteState}`}
			style={{
				background: `linear-gradient(to right, ${gradientColors[siteState] || '#00bbff, #0088ff'})`,
				height: '360px',
				padding: '30px 0 48px',
			}}
		>
			{contextHolder}
			<div className="h-full flex flex-col box-border max-w-980px px-20px py-0 mx-auto my-0">
				<div className="px-5 flex justify-between items-center">
					<span className="text-xl font-bold">{siteName}</span>
				</div>

				<div className="mx-5 mt-auto flex items-center max-sm:justify-center max-sm:h-full max-sm:mx-0 max-sm:mb-2px">
					<div
						className={`w-10 h-10 min-w-10 mr-6 bg-white rounded-full relative
	max-md:w-30px max-md:min-w-30px max-md:h-30px
	max-md:after:w-30px max-md:after:w-30px
    max-sm:hidden                         // 420px 隐藏
    after:content-empty after:absolute after:inset-0 after:rounded-full 
    after:animate-breathing after:animate-duration-2s after:animate-iteration-infinite
					${
						{
							normal: 'after:bg-normal',
							error: 'after:bg-error',
							allError: 'after:bg-allErrors',
							wrong: 'after:bg-wrong',
							loading: 'after:bg-loading',
						}[siteState]
					}`}
					/>

					<div className="r-text flex flex-col min-w-0">
						<SwitchTransition mode="out-in">
							<CSSTransition key={siteState} classNames="fade" timeout={300}>
								<div className="text-40px max-md:text-34px max-sm:text-30px font-bold truncate">
									{statusNames[siteState]}
								</div>
							</CSSTransition>
						</SwitchTransition>

						<div className="text-sm mt-1 opacity-80 max-md:text-13px max-sm:text-12px">
							<SwitchTransition mode="out-in">
								<CSSTransition key={siteState} classNames="fade" timeout={300}>
									{siteState === 'loading' ? (
										<span>少女祈祷中...</span>
									) : siteState === 'wrong' ? (
										<span>出错啦(╯‵□′)╯︵┻━┻</span>
									) : (
										<div className="flex items-center">
											<span className="last-update">
												{`上次更新于 ${formatTimestamp(siteData?.timestamp).justTime}`}
												<span className="mx-2">|</span>
											</span>
											<div className="flex items-center">
												<span>更新频率 5 分钟</span>
												<Refresh
													className="refresh cursor-pointer ml-1.5 hover:opacity-80 transition-opacity"
													onClick={refreshStatus}
												/>
											</div>
										</div>
									)}
								</CSSTransition>
							</SwitchTransition>
						</div>
					</div>

					<div
						className={`overview hidden md:flex flex-col items-end ml-auto max-md:hidden ${siteState === 'loading' || siteState === 'wrong' ? 'opacity-0' : ''} transition-opacity duration-300`}
					>
						<div className="count opacity-80 mb-1">
							<span className="name">站点总数</span>
							<span className="num text-lg ml-1">{siteOverview?.count}</span>
						</div>
						<div className="status-num flex text-xl">
							<div className="ok-count flex items-center after:content-['/'] after:ml-6px after:mr-6px after:text-16px">
								<span className="name">正常</span>
								<span className="num ml-1">{siteOverview?.okCount}</span>
							</div>
							<div className="down-count flex items-center">
								<span className="name">异常</span>
								<span className="num ml-1">{siteOverview?.downCount}</span>
							</div>
						</div>
					</div>
				</div>
			</div>
		</header>
	);
};

export default Header;
