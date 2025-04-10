// src/components/organisms/SiteStatusList.tsx
import React, { useState } from 'react';
import { Button, Modal, Result } from 'antd';
import { useStatusStore } from '../../stores/status';
import SiteCharts from '../molecules/SiteCharts';
import SiteItem from '../molecules/SiteItem';
import { CSSTransition, SwitchTransition } from 'react-transition-group';
import { ProcessedData } from '../../model';

interface SiteStatusListProps {}

const SiteStatusList: React.FC<SiteStatusListProps> = () => {
	const { siteState, siteDatas } = useStatusStore();
	const [siteDetailsShow, setSiteDetailsShow] = useState<boolean>(false);
	const [siteDetailsData, setSiteDetailsData] = useState<ProcessedData | null>(null);

	// 开启弹窗
	const showSiteDetails = (data: ProcessedData) => {
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
					siteState !== 'loading' && siteDatas ? (
						<div className="w-full">
							{siteDatas.map((site) => (
								<SiteItem
									key={site.id}
									site={site}
									onClick={() => showSiteDetails(site)}
								/>
							))}
							<Modal
								title={siteDetailsData?.name}
								open={siteDetailsShow}
								onCancel={closeSiteDetails}
								footer={null}
								className="ant-modal min-w-30rem max-w-960px w-68vw mt-20px"
							>
								{siteDetailsData && <SiteCharts siteDetails={siteDetailsData} />}
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

export default React.memo(SiteStatusList);
