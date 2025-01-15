import React from 'react';
import { createBrowserRouter } from 'react-router-dom';

import AppLayout from '@/layouts/AppLayout';
import AuthLayout from '@/layouts/AuthLayout';

const LoginPage = React.lazy(() => import('@/pages/AuthPage/Login'));
const DashboardPage = React.lazy(() => import('@/pages/DashboardPage'));
const BranchPage = React.lazy(() => import('@/pages/BranchPage'));
const HotelPage = React.lazy(() => import('@/pages/HotelPage'));
const AmenityPage = React.lazy(() => import('@/pages/AmenityPage'));
const HotelDetailPage = React.lazy(() => import('@/pages/HotelPage/HotelDetailPage'));
const UserPage = React.lazy(() => import('@/pages/UserPage'));

const StaffRoomPage = React.lazy(() => import('@/pages/StaffRoomPage'));

import { ROUTE_PATH } from './route.constant';
import MainLayout from '@/layouts/MainLayout';

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
      {
        element: <MainLayout />,
        children: [
          {
            path: ROUTE_PATH.DASHBOARD,
            element: <DashboardPage />,
          },
          {
            path: ROUTE_PATH.BRANCH,
            element: <BranchPage />,
          },
          {
            path: ROUTE_PATH.HOTEL,
            element: <HotelPage />,
          },
          {
            path: ROUTE_PATH.AMENITY,
            element: <AmenityPage />,
          },
          {
            path: `${ROUTE_PATH.HOTEL}/:slug`,
            element: <HotelDetailPage />,
          },
          {
            path: ROUTE_PATH.USER,
            element: <UserPage />,
          },
          {
            path: ROUTE_PATH.ROOMS,
            element: <StaffRoomPage />,
          }
        ],
      },
    ],
  },
]);
