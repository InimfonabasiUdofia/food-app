import styles from './home.module.css';
import { useParams } from 'react-router-dom';

const Result = () => {
  const { score } = useParams();
  console.log(score);

  // Convert score to a number and calculate the percentage
  const sum = score ? (Number(score) / 90) * 100 : 0; // Default to 0 if score is not present

  return (
    <>
      <div className="container mx-auto grid lg:grid-cols-3 sm:px-1 lg:px-4 md:px-20">
        <div className=""></div>
        <div className="text-center pt-5 flex justify-center">
          <progress id="file" value={sum} max="100"> {sum.toFixed(0)}% </progress>
        <div className='text-center'></div>
        <div className='text-center'>{sum.toFixed(0)}%</div>
        </div>
      </div>
    </>
  );
};

export default Result;