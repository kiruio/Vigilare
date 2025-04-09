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
				<div className="container">
					<div className="all-site">
						<SiteStatus siteData={siteData} days={countDays} />
					</div>
				</div>
			</main>
			<Footer />
		</>
	);
};

export default App;
