import React from 'react';
import { createBrowserRouter } from 'react-router-dom';

import AppLayout from '@/layouts/AppLayout';
import AuthLayout from '@/layouts/AuthLayout';

const LoginPage = React.lazy(() => import('@/pages/AuthPage/Login'));

import { ROUTE_PATH } from './route.constant';

export const router = createBrowserRouter([
  {
    path: '/',
    element: <AppLayout />,
    children: [
      {
        element: <AuthLayout />,
        children: [
          {
            path: ROUTE_PATH.LOGIN,
            element: <LoginPage />,
          },
        ],
      },
    ],
  },
]);
