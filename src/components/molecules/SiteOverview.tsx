import React from 'react';
import { useStatusStore } from '../../stores/status';
import { useI18n } from '../../hooks/useLocales';

interface SiteOverviewProps {}

const SiteOverview: React.FC<SiteOverviewProps> = () => {
	const { siteState, siteOverview } = useStatusStore();
	const { t } = useI18n();

	return (
		<div
			className={`overview hidden md:flex flex-col items-end ml-auto max-md:hidden ${siteState === 'loading' || siteState === 'wrong' ? 'opacity-0' : ''} transition-opacity duration-300`}
		>
			<div className="count opacity-80 mb-1">
				<span className="name">{t('header.overview.total')}</span>
				<span className="num text-lg ml-1">{siteOverview?.count}</span>
			</div>
			<div className="status-num flex text-xl">
				<div className="ok-count flex items-center after:content-['/'] after:ml-6px after:mr-6px after:text-16px">
					<span className="name">{t('header.overview.normal')}</span>
					<span className="num ml-1">{siteOverview?.okCount}</span>
				</div>
				<div className="down-count flex items-center">
					<span className="name">{t('header.overview.error')}</span>
					<span className="num ml-1">{siteOverview?.downCount}</span>
				</div>
			</div>
		</div>
	);
};

export default SiteOverview;
