
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
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
      <RouterProvider router={router} />
    </>
  )
}

export default App
