import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router';
import routers from './router';
import '@ant-design/v5-patch-for-react-19';

const rootEl = document.getElementById('root');
if (rootEl) {
  const root = ReactDOM.createRoot(rootEl);
  root.render(
    <React.StrictMode>
        <RouterProvider router={routers}>
        </RouterProvider>
    </React.StrictMode>,
  );
}
