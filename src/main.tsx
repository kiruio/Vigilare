import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import '@/style/index.less';
import 'virtual:uno.css';
import 'uno.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
	<React.StrictMode>
		<App />
	</React.StrictMode>
);
