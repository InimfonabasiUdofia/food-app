import React, { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { sign} from "../../configure/configure.tsx"; // Import your Firebase auth instance
import { useNavigate } from "react-router-dom";
import loadingimg from '/blackspin.svg'

// Define the props type for the ProtectedRoute component
interface ProtectedRouteProps {
  children: React.ReactNode; // Explicitly type the children prop
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true); // Add a loading state

  useEffect(() => {
    // Listen for authentication state changes
    const unsubscribe = onAuthStateChanged(sign, (user) => {
      if (!user) {
        // If the user is not authenticated, redirect to the login page
        navigate("/login");
      } else {
        // If the user is authenticated, allow rendering of children
        setIsLoading(false);
      }
    });

    // Cleanup the listener when the component unmounts
    return () => unsubscribe();
  }, [navigate, sign]); // Add `auth` to the dependency array

  // Show a loading spinner or message while checking authentication
  if (isLoading) {
    return <div className="flex justify-center  self-center mt-20">
              <img className='h-[80px]' src={loadingimg} alt="" />
          </div>; // Replace with a proper loading component
  }

  // If the user is authenticated, render the children (protected content)
  return <>{children}</>;
};

export default ProtectedRoute;