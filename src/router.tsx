import { createBrowserRouter } from "react-router";
import Demo from './pages/demo';
import App from "./App";
import UserLayout from "./layout/userLayout";
import NotFound from "./NotFound";

const routers = createBrowserRouter([
  { path: '/', element: <App /> },
  {
    Component: UserLayout,
    children: [
      { index: true, element: <Demo /> },
    ],
  },
  {
    path: '*',
    element: <NotFound />,
  },
]);

export default routers;