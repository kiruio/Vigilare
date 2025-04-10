import { useEffect } from 'react';
import { getSiteData } from './utils/getSiteData';
import MainLayout from './components/templates/MainLayout';

const App = () => {
	useEffect(() => {
		getSiteData();
	}, []); // 更新依赖项

	return <MainLayout />;
};

export default App;
