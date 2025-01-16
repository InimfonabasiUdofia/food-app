
import './App.css'
import Exams from './component/page/exams'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Home from './component/page/home';
import Result from './component/page/result.jsx'
import { Login } from './auth/login.js';
import { Signup } from './auth/signup.js';
function App() {
  const router = createBrowserRouter([
    {
      path: "/exams/:id",
      element:  <Exams/>,
    }, {
      path: "/",
      element:  <Home/>,
    },
    {
      path: "/result/:score",
      element:  <Result/>,
    },
    {
      path: "/login",
      element:  <Login/>,
    },
    {
      path: "/signup",
      element:  <Signup/>,
    },
  ]);
  return(
    <>
       <RouterProvider router={router} />
    </>
  )
  
}

export default App
