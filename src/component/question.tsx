
import he from 'he';
const Question = ({ans,number}:any) => {
  return (
   <>
         <p className='text-white px-5 text-lg font-medium'>{he.decode(ans[number]?.question)}</p>
   </>
  )
}

export default Question