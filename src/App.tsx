import React  from 'react';
import './App.css'
import Exams from './component/page/exams'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Home from './component/page/home';
import Result from './component/page/result.jsx'
import Login  from './auth/login.js';
import { Signup } from './auth/signup.js';
import  Dashboard  from './component/dashboard/dashboard.js';
import ProtectedRoute from './component/page/protected.js';
import NotFound from './component/page/notfound.js';
function App() {
  const router = createBrowserRouter([
    {
      path: "/exams/:id/:subject",
      element: <><Exams /></>,
    }, {
      path: "/",
      element: 
      <> 
        <ProtectedRoute>
          <Home/>
        </ProtectedRoute>
      </>,
    },
    {
      path: "/result/:score",
      element:     
      <> 
      <ProtectedRoute>
        <Result/>
      </ProtectedRoute>
    </>,
    },
    {
      path: "/login",
      element:  <Login/>,
    },
    {
      path: "/signup",
      element:  <Signup/>,
    },
    {
      path: "/dashboard",
      element: (
        <ProtectedRoute>
          <Dashboard />
        </ProtectedRoute>
      ),
    },
    {
      path: "/* /index.html 200", 
      element: <NotFound />,
    },
    
  ]);
  return(
    <>
       
       <React.Fragment>
          <RouterProvider router={router} />
       </React.Fragment>
    </>
  )
  
}

export default App
