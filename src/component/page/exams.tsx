
import { useEffect, useState } from 'react';
import style from './answer.module.css';
import he from 'he';

import Question from '../question.tsx'
import Answers from '../answer/answer.tsx'
import { Link, useParams ,useNavigate } from 'react-router-dom'


interface SelectedAnswers {
  [key: string]: string; 
}

interface Answerprop {
  incorrect_answers: string[];
  correct_answer: string;
}

const Exams = () => {
  
  const [isloading, setIsLoading] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate()
  const [number, setNumber] = useState(0);
  const [ans, setAns] = useState<Answerprop[]>([]);
  const [start ,setStart]=useState(false)
  const [boxcolor,setBoxcolor]=useState(false)
  const [error,setError]=useState(false)

  async function answer() {
      try {
          setIsLoading(true);
          let response = await fetch('https://opentdb.com/api.php?amount=30&category='+id+'&type=multiple');
          if (!response.ok) {
            setError(false)
              throw new Error('Network response was not ok'); 
          }
          let data = await response.json();
          setAns(data.results);
          console.log(data);
      } catch (error) {
          console.error('There was a problem with the fetch operation:', error);
          setError(true)
      } finally {
          setIsLoading(false); // Set loading to false here
      }
  } 

      console.log(ans)
      console.log(number)
      
      // const [timeRemaining, setTimeRemaining] = useState(20 * 60); // 20 minutes in seconds
      
      //     useEffect(() => {
      //         const interval = setInterval(() => {
      //             setTimeRemaining((prevTime) => {
      //                 if (prevTime <= 0) {
      //                     clearInterval(interval);
      //                     return 0; // Stop at 0
      //                 }
      //                 return prevTime - 1;
      //             });
      //         }, 1000);
      
      //         return () => clearInterval(interval); // Cleanup on unmount
      //     }, []);
      
      //     const minutes = Math.floor(timeRemaining / 60);
      //     const seconds = timeRemaining % 60;
      const [selectedAnswers, setSelectedAnswers] = useState<SelectedAnswers>({});
      const [shuffledAnswers, setShuffledAnswers] = useState<string[]>([]); 
    
      useEffect(() => {
        if (ans && ans[number]) {
          const incorrectAnswers = ans[number]?.incorrect_answers || [];
          const correctAnswer = ans[number]?.correct_answer || "";
          const answers = [...incorrectAnswers, correctAnswer];
          const shuffled = shuffleArray(answers); 
          setShuffledAnswers(shuffled); 
        } else {
          console.error("Invalid data structure for ans prop.");
        }
      }, [number, ans]); 
    
      const shuffleArray = (array: string[]): string[] => { 
        for (let i = array.length - 1; i > 0; i--) {
          const j = Math.floor(Math.random() * (i + 1));
          [array[i], array[j]] = [array[j], array[i]];
        }
        return array;
      };
      let [answervalue,setAnswervalue]=useState(false)
      const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSelectedAnswers({
          ...selectedAnswers,
          [`question${number}`]: event.target.value,
        });
        let valuecheck=event.target.checked
        console.log(valuecheck)
     
      };
      const [score, setScore] = useState(0);
      let totalScore = 0; 
    const checkAnswer = () => {
        for (let k = 0; k < 30; k++) {
            if (selectedAnswers[`question${k}`] === ans[k]?.correct_answer) {
                console.log('Correct Answer!');
                totalScore += 3; // Add 3 points for a correct answer
            } else {
                console.log('Wrong Answer');
                totalScore += 0; // No points for a wrong answer
            }
        }

        setScore(totalScore); // Update the state with the total score
        console.log("Total Score Calculated:", totalScore); 
      };
      console.log("Total Score Calculated:", score)
      
        return (
          <>   
          {!start?<div className="container mx-auto">
            <div className="flex justify-center mt-20">
              <div className="text-center">
              <p>Click Here to start</p> 
              <button onClick={()=>{
                setStart(true)
                answer()
              }} className=' bg-black text-white px-4 pt-2 pb-2 rounded mt-1   
              '>Start</button>
              </div>
             
            </div>
          </div>:
          <>
            {!isloading ?
              <>
              <div className="container mx-auto mt-4  lg:px-20 ">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 gap-3 ">
                  <div>
                    <div className="trapezoid mt-5 ">
                      <div className="relative bottom-7 flex justify-center">
                        <div className="box">
                          <svg xmlns="http://www.w3.org/2000/svg" width="80" height="80" fill="currentColor" className="bi bi-question" viewBox="0 0 16 16">
                              <path d="M5.255 5.786a.237.237 0 0 0 .241.247h.825c.138 0 .248-.113.266-.25.09-.656.54-1.134 1.342-1.134.686 0 1.314.343 1.314 1.168 0 .635-.374.927-.965 1.371-.673.489-1.206 1.06-1.168 1.987l.003.217a.25.25 0 0 0 .25.246h.811a.25.25 0 0 0 .25-.25v-.105c0-.718.273-.927 1.01-1.486.609-.463 1.244-.977 1.244-2.056 0-1.511-1.276-2.241-2.673-2.241-1.267 0-2.655.59-2.75 2.286m1.557 5.763c0 .533.425.927 1.01.927.609 0 1.028-.394 1.028-.927 0-.552-.42-.94-1.029-.94-.584 0-1.009.388-1.009.94"/>
                          </svg>
                        </div>
                      </div>
                      <Question ans={ans} number={number}/>
                    </div>
                  </div>  
                    <div className="">
                    <div className="lg:mt-16">
                      {shuffledAnswers.map((item, index) => (
                        <div
                          key={index}
                          className={
                            selectedAnswers[`question${number}`] === item
                              ? `${style.answerclick} pt-3 pb-3 px-3 rounded-lg`
                              : `${style.answer} pt-3 pb-3 px-3 rounded-lg`
                          }
                          onClick={
                            ()=>{
                              if(selectedAnswers[`question${number}`]!=""){
                                setAnswervalue(true)
                            }
                            }
                          }
                        >
                          <div className="flex gap-2">
                            <input
                              type="radio"
                              name={`question${number}`}
                              value={item}
                              checked={selectedAnswers[`question${number}`] === item}
                              onChange={handleChange}
                            />
                            <p>{he.decode(item)}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="text-center mt-9">
                    {number!=0 &&
                        <button className="button-55 mx-5" onClick={()=>{
                          if(number!=0){
                            setNumber(number-1)
                          }
                        }} role="button">Back</button>}
                        {number !=29 &&<button className="button-55 mx-5"onClick={()=>{
                            if(number!=29){
                              setNumber(number+1)
                            }
                        }} role="button">Next</button>}
                    </div>  
                    </div>   
                </div>
                <div className=" grid md:grid-cols-2 mt-6 text-center" >
                  <div className="flex flex-wrap">
                    {ans.map((_item,index)=>{
                        return(<>
                            <div key={index}  className={number===index||selectedAnswers[`question${index}`]?` currentsquare`:`square`} style={{
                              
                            }} onClick={()=>{
                              setNumber(index)
                            }}>{index+1}</div>
                        </>)
                      })}
                </div>
                </div>
                <div className=" mx-3 mt-4 lg:text-left md:text-center sm:text-left text-center">
                  
                  <button onClick={
                    ()=>{
                      checkAnswer()
                      const confirmSubmit = window.confirm('Do you want to submit?'); // Show confirmation dialog

                      if (confirmSubmit) {
                          navigate(`/result/${totalScore}`); // Navigate to the results page
                      }
                    }
                    
                  }  className='submitbtn' >Submit</button>
              </div>
              
              </div>
              
            </>  :
            <>
              <div className="container mx-auto ">
                <div className="grid md:grid-cols-2 flex lg:px-20  ">
                  <div className="rect mt-5"></div>
                  <div className="md:mt-14">
                    <div className="rect1"></div>
                    <div className="rect1"></div>
                    <div className="rect1"></div>
                    <div className="rect1"></div>
                  </div>
                </div>
              </div>
            </>
            }
            </>
            }
          </> 
  )
}
export default Exams