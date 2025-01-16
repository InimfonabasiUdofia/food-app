import React from 'react'
import styles from './auth.module.css'
export const Login = () => {
  return (
    <div className="container mx-auto px-5">
        <p className='text-center'>Login</p>
        <div className="">
            <input type="text" placeholder='Username' name=''/>
        </div>
        <button className=''>Submit</button>
    </div>
  )
}
