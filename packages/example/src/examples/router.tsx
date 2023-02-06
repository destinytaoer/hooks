import { RouteObject } from 'react-router-dom';
import UseMount from './use-mount';
import UseFullscreen from './use-fullscreen';

export const Route: RouteObject[] = [
  {
    path: '/use-mount',
    element: <UseMount />,
  },
  {
    path: '/use-fullscreen',
    element: <UseFullscreen />,
  },
];
