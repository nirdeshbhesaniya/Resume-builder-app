import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.jsx'
import { createBrowserRouter } from 'react-router-dom'
import SignInPage from './Auth/sign-in/index.jsx'
import { RouterProvider } from 'react-router'
import Dashboard from './dashboard'
import { ClerkProvider } from '@clerk/clerk-react'
import Home from './Home'
import EditResume from './dashboard/resume/[resumeId]/edit'
import ViewResume from './my-resume/[resumeId]/view'





const PUBLISHABLE_KEY = import.meta.env.VITE_CLERK_PUBLISHABLE_KEY
const router = createBrowserRouter([
  {
    path: "/",
    element: <Home/>
  },
  {
    element: <App />,
    children:[
      {
        path:"/dashboard",
        element:<Dashboard/> 
      },
      {
        path:"/dashboard/resume/:resumeId/edit",
        element: <EditResume/>,
      }
    ]
  },
  {
    path: "/auth/sign-in",
    element: <SignInPage />,
  },
  {
    path: "/my-resume/:resumeId/view",
    element:<ViewResume/>
  }
])
createRoot(document.getElementById('root')).render(
  <StrictMode>
    <ClerkProvider publishableKey={PUBLISHABLE_KEY}>
      <RouterProvider router={router} />
    </ClerkProvider>
  </StrictMode>,
)
