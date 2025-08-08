import React from 'react';
import ReactDOM from 'react-dom/client';
import '@ant-design/v5-patch-for-react-19';
import { RouterProvider } from 'react-router';
import routers from './router';
import { StyleProvider } from '@ant-design/cssinjs';
import { ConfigProvider } from 'antd';
import './index.css';
const rootEl = document.getElementById('root');
if (rootEl) {
  const root = ReactDOM.createRoot(rootEl);
  root.render(
    <React.StrictMode>
      <StyleProvider layer>
        <ConfigProvider>
          <RouterProvider router={routers}>
          </RouterProvider>
        </ConfigProvider>
      </StyleProvider>
    </React.StrictMode>,
  );
}
