import React, { useState } from 'react'
import styles from './auth.module.css'
import {sign,provider} from '../configure/configure.tsx'
import { createUserWithEmailAndPassword,signInWithPopup ,signOut} from 'firebase/auth';
export const Signup = () => {
    const [email,setEmail]=useState('')
    const [password,setPassword]=useState('')
    const createuser =async ()=>{
        try{
            await createUserWithEmailAndPassword(sign,email,password)
        }
        catch(e){
            console.error(e)
        }
    }
    const createusergoggle =async ()=>{
        try{
            await signInWithPopup(sign,provider)
        }
        catch(e){
            console.error(e)
        }
    }
    const logout =async ()=>{
        try{
            await signOut(sign)
        }
        catch(e){
            console.error(e)
        }
    }
    console.log(sign?.currentUser?.email)
  return (
    <div className="container mx-auto px-5">
        <p className='text-center'>Sign Up</p>
        <div className="">
            <input type="text" placeholder='Username'  onChange={(e)=>{
                setEmail(e.target.value)
            }} name=''/>
        </div>
        <div className="">
            <input type="Password" placeholder='Password' onChange={(e)=>{
                setPassword(e.target.value)
            }} name=''/>
        </div>
        <button onClick={createuser} className=''>Submit</button><br />
   
        <button onClick={createusergoggle}>Goggle</button><br />
        <button onClick={logout}>Log Out</button>
    </div>
  )
}
