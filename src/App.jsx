import { Outlet,Navigate } from "react-router-dom"
import { useUser } from '@clerk/clerk-react' // Replace '@some-library' with the actual library providing useUser
import Header from "./components/custom/Header";
import { Toaster } from "./components/ui/sonner";
import Footer from "./components/custom/Footer";
function App() {
  const {isLoaded,isSignedIn}=useUser();

  if(!isSignedIn&&isLoaded)
    {
      return <Navigate to={'/auth/sign-in'} />
    }
  return (
    <>
      <Header/>
      <Outlet />
      <Toaster/>
      <Footer/>
    </>
  )
}

export default App
