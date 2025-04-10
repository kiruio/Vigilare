import React from 'react';
import Footer from './Footer';
import Header from './Header';
import SiteStatusList from '../organisms/SiteStatusList';

interface MainLayoutProps {}

const MainLayout: React.FC<MainLayoutProps> = () => (
	<>
		<Header />
		<main id="main">
			<div className="p-20px translate-y--40px box-border max-w-980px px-20px py-0 mx-auto my-0">
				<div className="flex items-center justify-center min-h-200px ovh-hidden bg-mainBackground rd-16px shadow-[0_10px_30px_#0000001a]">
					<SiteStatusList />
				</div>
			</div>
		</main>
		<Footer />
	</>
);

export default MainLayout;
