import { useEffect, useState } from 'react';
import style from './answer.module.css';
import he from 'he';

interface SelectedAnswers {
  [key: string]: string; 
}

interface AnswerProps {
  ans: { 
    [key: number]: {
      incorrect_answers: string[];
      correct_answer: string;
    };
  };
  number: number;
}

const Answers = ({ ans, number }: AnswerProps) => {
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

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setSelectedAnswers({
      ...selectedAnswers,
      [`question${number}`]: event.target.value,
    });
  };
  let sumscore=0
  let k=0
  const checkAnswer = () => {
  while(k<=29){
    
      if (selectedAnswers[`question${k}`] === ans[k]?.correct_answer) { 
        console.log('Correct Answer!');
        sumscore=sumscore+3
        console.log(sumscore)
      } else {
        console.log('Wrong Answer');
        sumscore=sumscore+0
        console.log(sumscore)
      }
      k++;
    };
  }


  return (
    <>
     
      <div className="lg:mt-16">
        {shuffledAnswers.map((item, index) => (
          <div
            key={index}
            className={
              selectedAnswers[`question${number}`] === item
                ? `${style.answerclick} pt-3 pb-3 px-3 rounded-lg`
                : `${style.answer} pt-3 pb-3 px-3 rounded-lg`
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
     
    </>
  );
};

export default Answers;