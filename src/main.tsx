import microApp from '@micro-zoe/micro-app';
import ReactDOM from 'react-dom/client';
import App from './App';
import dayjs from 'dayjs';
dayjs.locale('zh-cn');

microApp.start();

ReactDOM.createRoot(document.getElementById('my-app') as HTMLElement).render(<App />);
