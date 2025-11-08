
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { Toaster } from 'react-hot-toast';
import { Provider } from 'react-redux';
import { store } from './store/store';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import ProtectedRoute from './routes/ProtectedRoute';
import ImageManagementPage from './pages/ImageManagementPage';

function App() {

  const router = createBrowserRouter([
    {path: '/login',element: <LoginPage/> },
    {path: '/signup',element: <SignUpPage/> },
    {path: '/',element:<><ProtectedRoute><ImageManagementPage/></ProtectedRoute></> },
  ])
  return (
    <>
        <Provider store={store}>

      <Toaster position="top-right" toastOptions={{
        style: {
          borderRadius: '10px',
          background: '#333',
          color: '#fff',
        },
      }} reverseOrder={false} />
      <RouterProvider router={router} />
      </Provider>
    </>
  )
}

export default App
