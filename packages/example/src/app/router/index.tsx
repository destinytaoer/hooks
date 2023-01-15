import { createBrowserRouter } from 'react-router-dom';
import Home from './home';
import { ExampleRouter } from '@/examples';
import ErrorPage from './error';
import NotFoundPage from './404';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
    errorElement: <ErrorPage />,
    children: ExampleRouter,
  },
  { path: '*', element: <NotFoundPage /> },
]);
