import { useState, useEffect, useCallback } from 'react';
import { getSiteData } from './utils/getSiteData';
import Header from './components/header';
import SiteStatus from './components/siteStatus';
import Footer from './components/footer';

const App = () => {
	const [siteData, setSiteData] = useState<unknown>(null); // 替换 any
	const apiKey = import.meta.env.VITE_API_KEY;
	const countDays = import.meta.env.VITE_COUNT_DAYS;

	const getSiteStatusData = useCallback(() => {
		setSiteData(null);
		getSiteData(apiKey, countDays).then(setSiteData);
	}, [apiKey, countDays]); // 添加依赖项

	useEffect(() => {
		getSiteStatusData();
	}, [getSiteStatusData]); // 更新依赖项

	return (
		<>
			<Header getSiteData={getSiteStatusData} />
			<main id="main">
				<div className="p-20px translate-y--40px box-border max-w-980px px-20px py-0 mx-auto my-0">
					<div className="flex items-center justify-center min-h-200px ovh-hidden bg-mainBackground rd-16px shadow-[0_10px_30px_#0000001a]">
						<SiteStatus siteData={siteData} days={countDays} />
					</div>
				</div>
			</main>
			<Footer />
		</>
	);
};

export default App;
