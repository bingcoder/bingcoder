import React from 'react';
import { RecoilRoot } from 'recoil';
import { ConfigProvider } from 'antd';
import AppLayout from './components/Layout';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';

import NotFound from './pages/404';

import 'antd/dist/reset.css';
import './App.css';

const apps = [
  {
    name: 'type-challenges',
    url: process.env.NODE_ENV === 'development' ? 'http://localhost:8081' : '/type-challenges',
  },
];

const App: React.FC = () => (
  <RecoilRoot>
    <Router>
      <ConfigProvider>
        <AppLayout>
          <Routes>
            <Route path="/" element={<div>home</div>} />
            {apps.map((app) => (
              <Route
                key={app.name}
                path={`/${app.name}/*`}
                element={<micro-app name={app.name} url={app.url} baseroute={`/${app.name}`} />}
              />
            ))}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </AppLayout>
      </ConfigProvider>
    </Router>
  </RecoilRoot>
);

export default App;
