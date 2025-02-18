import  {  useState } from 'react'
import { Link ,useNavigate} from 'react-router-dom'
import {db}from '../configure/configure.tsx'
import{collection ,addDoc }from 'firebase/firestore'
import {sign,provider} from '../configure/configure.tsx'
import { createUserWithEmailAndPassword,signInWithPopup } from 'firebase/auth';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FirebaseError } from 'firebase/app';
import submitIcon from '/Dual Ring@1x-1.0s-200px-200px.svg';


export const Signup = () => {
    
    const [email,setEmail]=useState('')
    const [password,setPassword]=useState('')
    const [eyeslash,setEyeslash]=useState(false)
    const [inputpassword,setInputpassword]=useState('Password')
    const [username,setusername]=useState('')
    const [errors, setError] = useState('An error occurred. Please try again.');
    const [Submitisloading ,setSubmitIsloading]=useState(false)
    const [Submitisloadinggoogle ,setSubmitIsloadinggoogle]=useState(false)
    const getmoviecollectionauth =collection(db,'auth')
    const navigate = useNavigate()
    const createuser =async (e:any)=>{
      e.preventDefault();
      setSubmitIsloading(true)
        try{
            await addDoc(getmoviecollectionauth,{username:username,email:email})
            await createUserWithEmailAndPassword(sign,email,password)
            toast.success("This is a success toast!", {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            });
        }
            catch (err) {
              const error = err as FirebaseError; // Cast the error to FirebaseError
              if (error.code === 'auth/email-already-in-use') {
                setError('This email is already in use. Please use a different email.');
              } else if (error.code === 'auth/invalid-email') {
                setError('Please enter a valid email address.');
              } else if (error.code === 'auth/weak-password') {
                setError('Password should be at least 6 characters.');
              } else if (error.code === 'auth/operation-not-allowed') {
                setError('Email/password sign-in is not enabled.');
              } else {
                setError('An error occurred. Please try again.');
              }
            toast.error(errors, {
              position: "top-right",
              autoClose: 3000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            });
             setSubmitIsloading(false)
        }finally{
          navigate('/')
          setSubmitIsloading(false)
        }
    }
    const createusergoggle =async ()=>{
        try{
          setSubmitIsloadinggoogle(true)
            await signInWithPopup(sign,provider)
        }
        catch(e){
            console.error(e)
        }finally{
          navigate('/')
          setSubmitIsloadinggoogle(false)
        }
    }
    console.log(sign?.currentUser?.email)
  return (
    <div className="container grid md:grid-cols-3  mx-auto px-5 text-center ">
      <div className=""></div>
       <div className="">
       <p className='text-center text-[1.7rem] font-bold pt-8'>Sign Up</p>
       <div className=" mt-10">
            <input type="text" className='border-2 border-black w-[85%] pt-1 pb-1 px-2' placeholder='Username'  onChange={(e)=>{
               setusername(e.target.value)
            }} name=''/>
        </div>
        <div className=" mt-5">
            <input type="text" className='border-2 border-black w-[85%] pt-1 pb-1 px-2' placeholder='Email'  onChange={(e)=>{
                setEmail(e.target.value)
            }} name=''/>
        </div>
        <div className="mt-5">
            <input type={inputpassword} className='w-[85%] border-2 border-black w-[85%] pt-1 pb-1  px-2 relative left-[10px]' placeholder='Password' onChange={(e)=>{
                setPassword(e.target.value)
            }} name=''/>
            <div className='float-right relative right-[50px] top-[10px]'>
            {eyeslash ?
            <>
              <svg onClick={()=>{
                setEyeslash(false)
                setInputpassword('Password')
              }} xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"  viewBox="0 0 16 16">
                <path d="M16 8s-3-5.5-8-5.5S0 8 0 8s3 5.5 8 5.5S16 8 16 8M1.173 8a13 13 0 0 1 1.66-2.043C4.12 4.668 5.88 3.5 8 3.5s3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755C11.879 11.332 10.119 12.5 8 12.5s-3.879-1.168-5.168-2.457A13 13 0 0 1 1.172 8z"/>
                <path d="M8 5.5a2.5 2.5 0 1 0 0 5 2.5 2.5 0 0 0 0-5M4.5 8a3.5 3.5 0 1 1 7 0 3.5 3.5 0 0 1-7 0"/>
              </svg>
            </>:
             <svg onClick={()=>{
                          setEyeslash(true)
                          setInputpassword('text')
                          
                        }}  xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor"  viewBox="0 0 16 16">
              <path d="M13.359 11.238C15.06 9.72 16 8 16 8s-3-5.5-8-5.5a7 7 0 0 0-2.79.588l.77.771A6 6 0 0 1 8 3.5c2.12 0 3.879 1.168 5.168 2.457A13 13 0 0 1 14.828 8q-.086.13-.195.288c-.335.48-.83 1.12-1.465 1.755q-.247.248-.517.486z"/>
              <path d="M11.297 9.176a3.5 3.5 0 0 0-4.474-4.474l.823.823a2.5 2.5 0 0 1 2.829 2.829zm-2.943 1.299.822.822a3.5 3.5 0 0 1-4.474-4.474l.823.823a2.5 2.5 0 0 0 2.829 2.829"/>
              <path d="M3.35 5.47q-.27.24-.518.487A13 13 0 0 0 1.172 8l.195.288c.335.48.83 1.12 1.465 1.755C4.121 11.332 5.881 12.5 8 12.5c.716 0 1.39-.133 2.02-.36l.77.772A7 7 0 0 1 8 13.5C3 13.5 0 8 0 8s.939-1.721 2.641-3.238l.708.709zm10.296 8.884-12-12 .708-.708 12 12z"/>
            </svg>}
            </div>
        </div>
            
        <button onClick={createuser} className='mt-5 w-[85%] pt-2 pb-2 bg-black text-white text-[1.09rem] font-bold '>{!Submitisloading ?'Submit':<div className='flex justify-center' ><img className='text-center  h-[26px]' src={submitIcon} alt="" /></div>}</button><br />
        <button className='text-[1.1rem] font-bold relative top-3 bg-white px-4 '>or</button>
          <div className="flex justify-center ">
            <div className="bg-black h-[2px] w-[85%] "></div>
          </div>
        <div className="flex justify-center pt-8">
        <button onClick={createusergoggle} className='w-[85%] flex  bg-black text-white justify-center gap-3 pt-2 pb-2'>
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
            <p className='text-[1.09rem] font-bold' >Continue with Goggle</p>
         </>
        :<div className='flex justify-center' ><img className='text-center  h-[26px]' src={submitIcon} alt="" /></div>}
        </button>
        </div>
        <p className='pt-3'>Already have an account ? <Link className='text-[#654456] underline' to="/login">Login</Link></p>
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
