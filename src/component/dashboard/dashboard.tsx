import { useEffect, useState } from 'react'
import { Doughnut } from 'react-chartjs-2';
import { db } from '../../configure/configure';
import { collection,getDocs } from 'firebase/firestore';
import {
    Chart as ChartJS,
    ArcElement,
    Tooltip,

} from 'chart.js';
import { Nav } from '../../nav/nav';

// Register the necessary components
ChartJS.register(ArcElement, Tooltip);
interface User {
    id:string;
    Score: number;
    Subject: string;
    studentname: string;
  }
export const Dashboard = () => {
    const [subjectlist,setsujectlist]= useState<User[]>([]);
    const data = {
        datasets: [
            {
                data: [7, 23], // Data for each segment
                backgroundColor: [
                    'white',
                    'black',  
                ],
                borderColor: [
                   ' black'
                ],
                borderWidth: 1,
            },
        ],
    };
    const getcollection=collection(db,'student')
    const resultdata=async()=>{
        const document=    await getDocs(getcollection)
        const subject=document.docs.map(doc => ({  ...doc.data() ,id: doc.id,}))as User[]
        setsujectlist(subject)
    }
    useEffect(
        ()=>{
            resultdata()
        }
        ,[])

    // Chart options
    
  return (
   <>

   
    <div className=' px-4 mt-4'>
       
    <Nav></Nav>
    <div className="container mx-auto lg:px-20  px-6 grid lg:grid-cols-2 ">
       {subjectlist.map((item,_index)=>{
        return(
        <>
        <div className="darken mt-5 px-4 lg:px-10  lg:w-[70%] pt-2 pb-3 rounded ">
            <div className="flex justify-between">
                <div className="">
                    <p className='text-[1.2rem] font-bold pt-2'> Course: {item.Subject}</p>
                    <p className='text-[1rem] font-bold '>{item.Score}/30</p>
                    <p className='text-[1rem] font-bold '>{Number((item.Score/30)*100).toFixed(0)}%</p>
                </div>
                <div className="h-40">
                    <Doughnut data={data}  />
                </div>
            </div>
       </div>
        </>)
       })}
       </div>
    </div>
   </>
  )
}
