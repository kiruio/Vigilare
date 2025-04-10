import React from 'react';
import { useStatusStore } from '../../stores/status';

interface SiteOverviewProps {}

const SiteOverview: React.FC<SiteOverviewProps> = () => {
	const { siteState, siteOverview } = useStatusStore();

	return (
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
	);
};

export default SiteOverview;
