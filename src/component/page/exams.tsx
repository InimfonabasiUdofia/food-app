import { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { addDoc, collection } from 'firebase/firestore';
import he from 'he';
import { db } from '../../configure/configure.tsx';

interface QuestionData {
  incorrect_answers: string[];
  correct_answer: string;
  question: string;
}

interface SelectedAnswers {
  [key: string]: string;
}

const EXAM_DURATION_MINUTES = 20;
const QUESTIONS_COUNT = 30;
const POINTS_PER_CORRECT_ANSWER = 3;

const Exams = () => {
  const { id, subject } = useParams<{ id: string; subject: string }>();
  const navigate = useNavigate();
  
  // State management
  const [isLoading, setIsLoading] = useState(false);
  const [questions, setQuestions] = useState<QuestionData[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswers, setSelectedAnswers] = useState<SelectedAnswers>({});
  const [shuffledOptions, setShuffledOptions] = useState<string[]>([]);
  const [timeLeft, setTimeLeft] = useState(EXAM_DURATION_MINUTES * 60);
  const [hasStarted, setHasStarted] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [progress, setProgress] = useState(0);

  // Memoized shuffle function
  const shuffleArray = useCallback((array: string[]): string[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  }, []);

  // Fetch questions
  const fetchQuestions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const response = await fetch(
        `https://opentdb.com/api.php?amount=${QUESTIONS_COUNT}&category=${id}&type=multiple`
      );
      
      if (!response.ok) throw new Error('Failed to fetch questions');
      
      const data = await response.json();
      if (!data.results) throw new Error('Invalid question data');
      
      setQuestions(data.results);
    } catch (err) {
      console.error('Fetch error:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  }, [id]);

  // Shuffle options when question changes
  useEffect(() => {
    if (questions.length > 0 && questions[currentIndex]) {
      const { incorrect_answers, correct_answer } = questions[currentIndex];
      const options = [...incorrect_answers, correct_answer];
      setShuffledOptions(shuffleArray(options));
    }
  }, [currentIndex, questions, shuffleArray]);

  // Update progress
  useEffect(() => {
    const answeredCount = Object.keys(selectedAnswers).length;
    setProgress(Math.round((answeredCount / QUESTIONS_COUNT) * 100));
  }, [selectedAnswers]);

  // Timer effect
  useEffect(() => {
    if (!hasStarted || timeLeft <= 0) return;

    const timerId = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timerId);
  }, [hasStarted, timeLeft]);

  // Handle time expiration
  useEffect(() => {
    if (timeLeft <= 0 && hasStarted) {
      submitExam();
    }
  }, [timeLeft, hasStarted]);

  // Calculate score
  const calculateScore = useCallback(() => {
    return questions.reduce((score, question, index) => {
      return selectedAnswers[`question${index}`] === question.correct_answer
        ? score + POINTS_PER_CORRECT_ANSWER
        : score;
    }, 0);
  }, [questions, selectedAnswers]);

  // Submit exam
  const submitExam = useCallback(async () => {
    setIsSubmitting(true);
    const score = calculateScore();
    
    try {
      await addDoc(collection(db, 'result'), {
        score: score,
        subject: subject,
        timestamp: new Date()
      });
      
      navigate(`/result/${score}`);
    } catch (err) {
      console.error('Submission error:', err);
      setError('Failed to submit exam results');
    } finally {
      setIsSubmitting(false);
    }
  }, [calculateScore, navigate, subject]);

  // Handle answer selection
  const handleAnswerSelect = (answer: string) => {
    setSelectedAnswers(prev => ({
      ...prev,
      [`question${currentIndex}`]: answer
    }));
  };

  // Format time display
  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  // Start exam
  const startExam = () => {
    setHasStarted(true);
    fetchQuestions();
  };

  if (!hasStarted) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
        <div className="text-center p-8 bg-white rounded-xl shadow-lg max-w-md w-full mx-4">
          <div className="w-20 h-20 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-10 w-10 text-blue-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <h1 className="text-3xl font-bold text-gray-800 mb-3">Ready for Your {subject} Exam?</h1>
          <p className="text-gray-600 mb-6">
            You'll have {EXAM_DURATION_MINUTES} minutes to complete {QUESTIONS_COUNT} questions.
            Answer carefully as you can't go back after submission.
          </p>
          <button
            onClick={startExam}
            className="px-8 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-lg font-medium hover:from-blue-700 hover:to-indigo-700 transition-all shadow-md hover:shadow-lg w-full"
          >
            Start Exam Now
          </button>
          {error && (
            <div className="mt-4 p-3 bg-red-50 text-red-600 rounded-lg flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              {error}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <h2 className="text-xl font-semibold text-gray-700">Preparing Your Exam</h2>
          <p className="text-gray-500">Loading questions...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center p-6 bg-white rounded-xl shadow-md max-w-md mx-4">
          <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">Oops! Something went wrong</h2>
          <p className="text-gray-600 mb-6">{error}</p>
          <button
            onClick={fetchQuestions}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  if (questions.length === 0) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center p-6 bg-white rounded-xl shadow-md max-w-md mx-4">
          <div className="w-16 h-16 bg-yellow-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-yellow-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-2">No Questions Available</h2>
          <p className="text-gray-600 mb-6">We couldn't find any questions for this exam.</p>
          <button
            onClick={fetchQuestions}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Reload Questions
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentIndex];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-xl font-bold text-gray-800">{subject} Exam</h1>
            <p className="text-sm text-gray-500">Question {currentIndex + 1} of {QUESTIONS_COUNT}</p>
          </div>
          
          <div className="flex items-center space-x-4">
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <span className="font-mono font-medium text-gray-700">{formatTime(timeLeft)}</span>
            </div>
            
            <div className="w-32 bg-gray-200 rounded-full h-2.5">
              <div 
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-300" 
                style={{ width: `${progress}%` }}
              ></div>
            </div>
          </div>
        </div>
      </header>

      {/* Main content */}
      <main className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Question panel */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex items-start mb-6">
                <div className="bg-blue-100 p-2 rounded-lg mr-4">
                  <svg className="w-6 h-6 text-blue-600" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-8-3a1 1 0 00-.867.5 1 1 0 11-1.731-1A3 3 0 0113 8a3.001 3.001 0 01-2 2.83V11a1 1 0 11-2 0v-1a1 1 0 011-1 1 1 0 100-2zm0 8a1 1 0 100-2 1 1 0 000 2z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="flex-1">
                  <h2 className="text-lg font-semibold text-gray-800 mb-2">Question {currentIndex + 1}</h2>
                  <div className="prose max-w-none">
                    <p className="text-gray-700 text-lg">{he.decode(currentQuestion.question)}</p>
                  </div>
                  
                </div>
              </div>
              <div className="mt-10 flex ">
          <button
            onClick={() => setCurrentIndex(prev => Math.max(0, prev - 1))}
            disabled={currentIndex === 0}
            className={`px-6 mx-5 py-3 rounded-lg font-medium flex items-center ${
              currentIndex === 0
                ? 'bg-gray-200 text-gray-500 cursor-not-allowed'
                : 'button-30'
            }`}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Previous
          </button>
          
          {currentIndex < QUESTIONS_COUNT - 1 ? (
            <button
              onClick={() => setCurrentIndex(prev => prev + 1)}
              className=" button-30 "
            >
              Next
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </button>
          ) : (
            <button
              onClick={() => {
                if (window.confirm('Are you sure you want to submit your exam?')) {
                  submitExam();
                }
              }}
              disabled={isSubmitting}
              className="px-6 py-3 bg-green-600 text-white rounded-lg font-medium hover:bg-green-700 flex items-center"
            >
              {isSubmitting ? (
                <>
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Submitting...
                </>
              ) : (
                'Submit Exam'
              )}
            </button>
          )}
        </div>
            </div>
          </div>

          {/* Answer options */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Select your answer:</h3>
                <div className="space-y-3">
                  {shuffledOptions.map((option, idx) => (
                    <div
                      key={idx}
                      className={`p-4 rounded-lg cursor-pointer transition-all ${
                        selectedAnswers[`question${currentIndex}`] === option
                          ? 'bg-blue-50 border-2 border-blue-500'
                          : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                      }`}
                      onClick={() => handleAnswerSelect(option)}
                    >
                      <div className="flex items-center">
                        <div className={`w-5 h-5 rounded-full button-55 border-2 flex items-center justify-center mr-3 ${
                          selectedAnswers[`question${currentIndex}`] === option
                            ? 'border-blue-500 bg-blue-500'
                            : 'border-gray-400'
                        }`}>
                          {selectedAnswers[`question${currentIndex}`] === option && (
                            <div className="w-2 h-2 rounded-full bg-white"></div>
                          )}
                        </div>
                        <span className="text-gray-800">{he.decode(option)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Question navigation */}
            <div className="mt-6 bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-6">
                <h3 className="text-lg font-semibold text-gray-800 mb-4">Question Navigation</h3>
                <div className="grid grid-cols-5 gap-2">
                  {Array.from({ length: QUESTIONS_COUNT }).map((_, idx) => (
                    <button
                      key={idx}
                      onClick={() => setCurrentIndex(idx)}
                      className={`w-full h-10 rounded-md flex items-center justify-center text-sm font-medium ${
                        currentIndex === idx
                          ? 'bg-blue-600 text-white'
                          : selectedAnswers[`question${idx}`]
                            ? 'bg-green-100 text-green-800'
                            : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

      </main>
    </div>
  );
};

export default Exams;