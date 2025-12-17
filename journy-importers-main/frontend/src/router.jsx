import { createBrowserRouter } from 'react-router-dom';
import { SigninAccountForm } from './Components/Auth/Login';
import { Home } from './Components/Pages/HomePage';
import { ProducerPage } from './Components/Pages/ProducerPage';
import { CustomerProductDetails } from './Components/Pages/Product/Customer/CustomerProductDetails';
import { AddProduct } from './Components/Pages/Producer/addProduct';
import { ProducerProductDetails } from './Components/Pages/Producer/ProducerProductDetails';
import { UpdateProduct } from './Components/Pages/Producer/UpdateProduct/UpdateProduct';
import producerSidebarOptions from './Utils/sidebarOptions/producerSidebaroptions';
import ResetPasswordForm from './Components/Auth/ResetPasswordForm';
import { AboutUs } from './Components/Pages/AboutUs';
import { ComingSoon } from './Components/Routes/ComingSoon';
import { Outlet, useLocation } from 'react-router-dom';
import { useEffect, useRef } from 'react';
import { RegisterUser } from './Components/Auth/RegisterUser';
import ProfilePage from './Components/Pages/Producer/ProfilePage';
import EditProfile from './Components/Pages/Producer/EditProfile';
import Settings from './Components/Pages/Producer/Settings/Settings';
import ChangePlan from './Components/Pages/Producer/Settings/ChangePlan';
import { SuccessSubscription } from './Components/Pages/Producer/Settings/SuccessSubscription';
import { CancelCheckout } from './Components/Pages/Producer/Settings/CancelCheckout';
import { NewSubscription } from './Components/Auth/registerSteps/newSubscription';
import { CancelSignupCheckout } from './Components/Auth/registerSteps/CancelSignupCheckout';
import { ImporterPage } from './Components/Pages/ImporterPage';
import { ImporterProductDetails } from './Components/Pages/ImporterProductDetails';
import { ConnectWithProducer } from './Components/Pages/ConnectWithProducer';
import { ConnectionRequests } from './Components/Pages/Producer/ConnectionRequests';
import ImporterProfilePage from './Components/Pages/importer/profile/ImporterProfilePage';
import ImporterEditProfile from './Components/Pages/importer/profile/ImporterEditProfile';
import ImporterSettings from './Components/Pages/importer/profile/ImporterSettings';
import ImporterChangePlan from './Components/Pages/importer/profile/changePlan/ImporterChangePlan';
import { ImporterSuccessSubscription } from './Components/Pages/importer/profile/changePlan/ImporterSuccessSubscription';
import { ImporterCancelCheckout } from './Components/Pages/importer/profile/changePlan/ImporterCancelCheckout';

const RootLayout = () => {
  const location = useLocation();
  const rootRef = useRef(null);

  useEffect(() => {
    try {
      if (rootRef.current) {
        // Primary scroll method
        rootRef.current.scrollIntoView({
          behavior: 'instant',
          block: 'start',
        });

        // Backup scroll method
        requestAnimationFrame(() => {
          window.scrollTo(0, 0);
        });
      }
    } catch (error) {
      // Fallback if scrollIntoView fails
      window.scrollTo(0, 0);
    }
  }, [location.pathname]);

  return (
    <div ref={rootRef}>
      <Outlet />
    </div>
  );
};

export const Router = createBrowserRouter([
  {
    path: '/',
    element: <Home />,
  },
  {
    path: '/about',
    element: <AboutUs />,
  },
  // {
  //   path: '/ProducerSupplierLogin',
  //   element: <ProducerSupplierLogin />,
  // },

  {
    path: '/login',
    element: <SigninAccountForm />,
  },

  {
    path: '/reset-password/:token',
    element: <ResetPasswordForm />,
  },
  {
    path: '/signup',
    element: <RegisterUser />,
  },

  {
    path: '/producer',
    // element: <AppLayout sidebarOptions={producerSidebarOptions} />,
    children: [
      { path: '', element: <ProducerPage />, index: true },
      { path: 'connections', element: <ConnectionRequests /> },
      { path: 'addproduct', element: <AddProduct /> },
      { path: 'product/:id', element: <ProducerProductDetails /> },
      { path: 'updateproduct/:id', element: <UpdateProduct /> },
      { path: 'profile', element: <ProfilePage /> },
      { path: 'profile/edit', element: <EditProfile /> },
      { path: 'profile/settings', element: <Settings /> },
      { path: 'profile/settings/plan', element: <ChangePlan /> },
    ],
  },

  {
    path: '/importer',
    children: [
      { path: '', element: <ImporterPage />, index: true },
      { path: 'connect', element: <ConnectWithProducer /> },
      { path: 'product/:id', element: <ImporterProductDetails /> },
      { path: 'profile', element: <ImporterProfilePage /> },
      { path: 'profile/edit', element: <ImporterEditProfile /> },
      { path: 'profile/settings', element: <ImporterSettings /> },
      { path: 'profile/settings/plan', element: <ImporterChangePlan /> },
    ],
  },

  {
    path: '/product/:id',
    element: <CustomerProductDetails />,
  },

  {
    path: '/coming-soon',
    element: <ComingSoon />,
  },

  {
    path: '/chooseplan-success',
    element: <NewSubscription />,
  },
  {
    path: '/chooseplan-canceled',
    element: <CancelSignupCheckout />,
  },
  
  {
    path: '/success',
    element: <SuccessSubscription />,
  },
  {
    path: '/canceled',
    element: <CancelCheckout />,
  },

  {
    path: '/importer-success',
    element: <ImporterSuccessSubscription />,
  },
  {
    path: '/importer-canceled',
    element: <ImporterCancelCheckout />,
  },
]);
