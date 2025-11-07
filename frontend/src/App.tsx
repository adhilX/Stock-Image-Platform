
import { createBrowserRouter, RouterProvider, Navigate } from 'react-router-dom'
import { Toaster } from 'react-hot-toast';
import { Provider } from 'react-redux';
import { store } from './store/store';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
// import ProtectedRoute from './routes/ProtectedRoute';

function App() {

  const router = createBrowserRouter([
    {path: '/', element: <Navigate to="/login" replace />},
    {path: '/login',element: <LoginPage/> },
    {path: '/signup',element: <SignUpPage/> },
    // {path: '/',element:<><ProtectedRoute></></ProtectedRoute></> },
  ])
  return (
    <>
        <Provider store={store}>

      <Toaster position="top-right" reverseOrder={false} />
      <RouterProvider router={router} />
      </Provider>
    </>
  )
}

export default App
