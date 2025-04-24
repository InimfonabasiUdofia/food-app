import { useParams } from 'react-router-dom';
import { getDoc, doc, setDoc } from "firebase/firestore";
import { sign, db } from '../../configure/configure';
import { useEffect, useState, useCallback } from 'react';
import { Nav } from '../../nav/nav';
import loadingimg from '/blackspin.svg';

interface User {
  id: string;
  email: string;
  username: string;
}

const Result = () => {
  const { score } = useParams();
  const [userData, setUserData] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Memoized fetch function
  const fetchData = useCallback(async () => {
    const currentUser = sign.currentUser;

    if (!currentUser) {
      setLoading(false);
      setError('Please sign in to view results');
      return;
    }

    try {
      const userDocRef = doc(db, "users", currentUser.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        setUserData({ id: userDocSnap.id, ...userDocSnap.data() } as User);
      } else {
        await setDoc(userDocRef, {
          email: currentUser.email,
          username: currentUser.displayName || `User${currentUser.uid.slice(0, 4)}`,
          createdAt: new Date().toISOString(),
          lastLogin: new Date().toISOString(),
        });
        // Use the data we just set instead of fetching again
        setUserData({
          id: currentUser.uid,
          email: currentUser.email || '',
          username: currentUser.displayName || `User${currentUser.uid.slice(0, 4)}`
        });
      }
    } catch (err) {
      console.error("Error fetching data: ", err);
      setError('Failed to load results');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => fetchData(), 150); // Small delay to prevent flash
    return () => clearTimeout(timer);
  }, [fetchData]);

  // Calculate score
  const numericScore = score ? Number(score) : 0;
  const percentage = Math.round((numericScore / 90) * 100);
  const performanceLevel = 
    percentage >= 80 ? 'Excellent' :
    percentage >= 60 ? 'Good' :
    percentage >= 40 ? 'Average' : 'Needs Improvement';

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh]">
        <img 
          className="h-20 w-20 animate-spin" 
          src={loadingimg} 
          alt="Loading results" 
          aria-label="Loading spinner"
        />
        <p className="mt-4 text-gray-600">Loading your results...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] p-4">
        <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg mb-4 max-w-md text-center">
          {error}
        </div>
        <button 
          onClick={fetchData}
          className="bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          Try Again
        </button>
      </div>
    );
  }

  return (
    <>
      <Nav />
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-4xl mx-auto px-4 py-12 sm:px-6 lg:px-8">
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            {/* Header */}
            <div className="bg-gradient-to-r from-blue-600 to-indigo-700 px-6 py-8 text-center">
              <h1 className="text-3xl font-bold text-white">Quiz Results</h1>
              {userData && (
                <p className="mt-2 text-blue-100">
                  Congratulations, <span className="font-semibold">{userData.username}</span>!
                </p>
              )}
            </div>

            {/* Content */}
            <div className="px-6 py-8 sm:px-10">
              {/* Score Display */}
              <div className="flex flex-col items-center mb-10">
                <div className="relative w-48 h-48 mb-6">
                  <div className="absolute inset-0 rounded-full bg-blue-50 flex items-center justify-center">
                    <div className="text-center">
                      <span className="text-5xl font-bold text-blue-700">{percentage}%</span>
                      <p className="text-blue-500 mt-2">{performanceLevel}</p>
                    </div>
                  </div>
                  <svg className="absolute inset-0 w-full h-full" viewBox="0 0 100 100">
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#e0e7ff"
                      strokeWidth="8"
                    />
                    <circle
                      cx="50"
                      cy="50"
                      r="45"
                      fill="none"
                      stroke="#4f46e5"
                      strokeWidth="8"
                      strokeDasharray={`${percentage} 100`}
                      strokeLinecap="round"
                      transform="rotate(-90 50 50)"
                    />
                  </svg>
                </div>

                <div className="text-center">
                  <p className="text-gray-600">You scored</p>
                  <p className="text-4xl font-bold text-gray-900">
                    {(numericScore/3)} <span className="text-gray-500">/ 30</span>
                  </p>
                </div>
              </div>

              {/* Performance Breakdown */}
              <div className="bg-gray-50 rounded-xl p-6 mb-8">
                <h3 className="text-lg font-medium text-gray-900 mb-4">Performance Breakdown</h3>
                <div className="space-y-4">
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-700">Correct Answers</span>
                      <span className="font-medium">{numericScore/3} questions</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-green-500 h-2.5 rounded-full" 
                        style={{ width: `${percentage}%` }}
                      ></div>
                    </div>
                  </div>
                  <div>
                    <div className="flex justify-between mb-1">
                      <span className="text-gray-700">Incorrect Answers</span>
                      <span className="font-medium">{ 30-(numericScore/3)} questions</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2.5">
                      <div 
                        className="bg-red-500 h-2.5 rounded-full" 
                        style={{ width: `${100 - percentage}%` }}
                      ></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Result;