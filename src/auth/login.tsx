import { useState } from 'react'
import {sign,provider} from '../configure/configure.tsx'
import { signInWithEmailAndPassword ,signInWithRedirect} from 'firebase/auth'
import { FirebaseError } from 'firebase/app';
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer, toast } from 'react-toastify';
import submitIcon from '/Dual Ring@1x-1.0s-200px-200px.svg';

export const Login = () => {
  const [email ,setEmail]=useState('')
  const [password ,setPassword]=useState('')
  const [checkerror ,setError]=useState('An error occurred. Please try again.')
  const [Submitisloading ,setSubmitIsloading]=useState(false)
  const [Submitisloadinggoogle ,setSubmitIsloadinggoogle]=useState(false)

  const submit=async()=>{
      try{
        setSubmitIsloading(true)
        await signInWithEmailAndPassword(sign,email,password)
      }catch(err){
        console.log(err)
        const error = err as FirebaseError; // Cast the error to FirebaseError
        if (error.code === 'auth/invalid-email') {
          setError('Invalid email address.');
        } else if (error.code === 'auth/user-disabled') {
          setError('User account disabled.');
        } else if (error.code === 'auth/user-not-found') {
          setError('User not found.');
        } else if (error.code === 'auth/wrong-password') {
          setError('Wrong password.');
        }else if (error.code === 'auth/too-many-requests') {
          setError('Too many requests. Try again later.');
        }else if (error.code === 'auth/network-request-failed') {
          setError('Network error. Please check your connection.');
        } else {
          setError('Error during login. Please try again.');
        }
        toast.error(checkerror, {
          position: "top-right",
          autoClose: 3000,
          hideProgressBar: false,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        });
      }finally{
        setSubmitIsloading(false)
      }
     
    }
    const createusergoggle =async ()=>{
      try{
        setSubmitIsloadinggoogle(false)
          await signInWithRedirect(sign,provider)
      }
      catch(e){
          console.error(e)
      }finally{
        setSubmitIsloadinggoogle(true)
      }
  }
  return (
    <div className="container grid md:grid-cols-3  mx-auto px-5 text-center ">
      <div className=""></div>
       <div className="">
       <p className='text-center text-[1.7rem] font-bold pt-8'>Login</p>

        <div className=" mt-12">
            <input type="text" className='border-2 border-black w-[85%] pt-1 pb-1 px-2' placeholder='Email'  onChange={(e)=>{
               setEmail(e.target.value)
            }} name=''/>
        </div>
        <div className="mt-5">
            <input type="Password" className='w-[85%] border-2 border-black w-[85%] pt-1 pb-1  px-2' placeholder='Password' onChange={(e)=>{
                   setPassword(e.target.value)
            }} name=''/>
        </div>
        <button onClick={submit}  className='mt-5 w-[85%] pt-2 pb-2 bg-black text-white text-[1.09rem] font-bold'>{!Submitisloading ?'Submit':<div className='flex justify-center' ><img className='text-center  h-[26px]' src={submitIcon} alt="" /></div>}</button><br />
        <button  className='text-[1.1rem] font-bold relative top-3 bg-white px-4 '>or</button>
          <div className="flex justify-center ">
            <div className="bg-black h-[2px] w-[85%] "></div>
          </div>
        <div className="flex justify-center pt-8">
        <button className='w-[85%] flex  bg-black text-white justify-center gap-3 pt-2 pb-2'>
        {!Submitisloadinggoogle ?
        <>
            <svg
            width="22"
            height="21"
            viewBox="0 0 22 21"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            >
            <path
              d="M21.2958 8.44357H20.45V8.4H11V12.6H16.9341C16.0683 15.0449 13.7421 16.8 11 16.8C7.52082 16.8 4.7 13.9792 4.7 10.5C4.7 7.02082 7.52082 4.2 11 4.2C12.606 4.2 14.067 4.80585 15.1795 5.79547L18.1494 2.82555C16.2741 1.07782 13.7657 0 11 0C5.20137 0 0.5 4.70137 0.5 10.5C0.5 16.2986 5.20137 21 11 21C16.7986 21 21.5 16.2986 21.5 10.5C21.5 9.79597 21.4275 9.10875 21.2958 8.44357Z"
              fill="#FFC107"
            />
            <path
              d="M1.71088 5.61277L5.16065 8.14275C6.0941 5.8317 8.35475 4.2 11.0002 4.2C12.6062 4.2 14.0673 4.80585 15.1798 5.79547L18.1497 2.82555C16.2744 1.07782 13.7659 0 11.0002 0C6.96718 0 3.46963 2.27692 1.71088 5.61277Z"
              fill="#FF3D00"
            />
            <path
              d="M10.9996 21C13.7118 21 16.1761 19.9621 18.0393 18.2742L14.7896 15.5243C13.7001 16.3533 12.3686 16.8015 10.9996 16.8C8.26855 16.8 5.94963 15.0586 5.07603 12.6284L1.65198 15.2665C3.38973 18.6669 6.91878 21 10.9996 21Z"
              fill="#4CAF50"
            />
            <path
              d="M21.2958 8.44354H20.45V8.39996H11V12.6H16.9341C16.52 13.7636 15.774 14.7804 14.7884 15.5247L14.79 15.5237L18.0397 18.2736C17.8098 18.4826 21.5 15.75 21.5 10.5C21.5 9.79594 21.4275 9.10871 21.2958 8.44354Z"
              fill="#1976D2"
            />
            </svg>    
            <p className='text-[1.09rem] font-bold' onClick={createusergoggle}>Continue with Goggle</p>
         </>
        :<div className='flex justify-center' ><img className='text-center  h-[26px]' src={submitIcon} alt="" /></div>}
       
        </button>
        </div>
       </div>
       <ToastContainer 
        position="top-right" // Position of the toast
        autoClose={5000} // Duration in milliseconds
        hideProgressBar={false} // Show progress bar
        closeOnClick // Close on click
        rtl={false} // Right to left
        pauseOnFocusLoss // Pause on focus loss
        draggable // Allow dragging
        pauseOnHover // Pause on hover
      />
    </div>
  )
}
