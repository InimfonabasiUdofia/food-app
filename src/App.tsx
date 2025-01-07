
import './App.css'
import Exams from './component/page/exams'
import {
  createBrowserRouter,
  RouterProvider,
} from "react-router-dom";
import Home from './component/page/home';
import Result from './component/page/result.jsx'
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
  ]);
  return(
    <>
       <RouterProvider router={router} />
    </>
  )
  
}

export default App
