import React, { useState } from 'react';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import message from 'antd/es/message';
import 'antd/es/message/style';
import Dropdown from 'antd/es/dropdown';
import 'antd/es/dropdown/style';
import { useStatusStore } from '../../stores/status';
import { useCacheStore } from '../../stores/cache';
import { formatTimestamp } from '../../utils/timeTools';
import StatusIcon from '../atoms/StatusIcon';
import { getSiteData } from '../../utils/getSiteData';
import SiteOverview from '../molecules/SiteOverview';
import { useI18n } from '../../hooks/useLocales';
import { MenuProps } from 'antd';

interface HeaderProps {}

const Header: React.FC<HeaderProps> = () => {
	const { t, setLang } = useI18n();

	const [messageApi, contextHolder] = message.useMessage();
	const [lastClickTime, setLastClickTime] = useState(0);
	const { siteState } = useStatusStore();
	const { siteData, changeSiteData } = useCacheStore();

	// 加载配置
	const siteName = import.meta.env.VITE_SITE_NAME;

	// 状态文本
	const statusNames: Record<string, string> = {
		loading: t('header.summary.loading'),
		error: t('header.summary.error'),
		allError: t('header.summary.allError'),
		normal: t('header.summary.normal'),
		wrong: t('header.summary.wrong'),
	};

	const gradientColors = {
		loading: '#00bbff, #0088ff',
		error: '#e47e7e, #ee5555',
		allError: '#ee5555, #ff2b2b',
		wrong: '#ee5555, #ff2b2b',
		normal: '#4fd69c, #24a66e',
	};

	const iconColor = {
		normal: 'bg-normal',
		error: 'bg-error',
		allError: 'bg-allErrors',
		wrong: 'bg-wrong',
		loading: 'bg-loading',
	};

	// 刷新状态
	const refreshStatus = () => {
		const currentTime = Date.now();
		if (currentTime - lastClickTime < 60000) {
			messageApi.open({
				key: 'updata',
				type: 'warning',
				content: t('common.tooFast'),
			});
			return false;
		}
		changeSiteData(null);
		getSiteData();
		setLastClickTime(currentTime);
	};

	const items: MenuProps['items'] = [
		{
			label: '简体中文',
			key: 'zh',
		},
		{
			label: 'English',
			key: 'en',
		},
	];

	const onClick: MenuProps['onClick'] = ({ key }) => {
		setLang(key as 'zh' | 'en');
	};

	return (
		<header
			id="header"
			className={`relative z-0 text-white box-border mb-1rem ${siteState}`}
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
					<Dropdown menu={{ items, onClick }} trigger={['click']}>
						<span className="i-lucide-languages" />
					</Dropdown>
				</div>

				<div className="mx-5 mt-auto flex items-center max-sm:justify-center max-sm:h-full max-sm:mx-0 max-sm:mb-2px">
					<StatusIcon
						color="bg-white"
						afterColor={iconColor[siteState]}
						className="w-10 h-10 min-w-10 mr-6 max-md:w-30px max-md:min-w-30px max-md:h-30px max-md:after:w-30px max-md:after:w-30px max-sm:hidden"
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
										<span>{t('common.loading')}</span>
									) : siteState === 'wrong' ? (
										<span>{t('common.wrong')}(╯‵□′)╯︵┻━┻</span>
									) : (
										<div className="flex items-center">
											<span className="last-update">
												{t('header.update').replace(
													'{time}',
													formatTimestamp(siteData?.timestamp).justTime
												)}
												<span className="mx-2">|</span>
											</span>
											<div className="flex items-center">
												<span>{t('header.updateAt')}</span>
												<span
													className="i-lucide-refresh-cw cursor-pointer ml-1.5 hover:opacity-80 transition-opacity"
													onClick={refreshStatus}
												/>
											</div>
										</div>
									)}
								</CSSTransition>
							</SwitchTransition>
						</div>
					</div>

					<SiteOverview />
				</div>
			</div>
		</header>
	);
};

export default Header;
