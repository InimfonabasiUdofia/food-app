import { useState, useEffect } from 'react';
import { db ,sign } from '../../configure/configure';
import { motion } from 'framer-motion';
import {  FiUser } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import {  onAuthStateChanged } from 'firebase/auth';
import { collection,  getDocs, query, Timestamp, where } from 'firebase/firestore';

interface YourDataType {
  id: string;
  score: number;
  subject: string;
  timestamp:Timestamp;
  // Add other fields as necessary
}
interface FirestoreUserData {
  uid: string;
  displayName: string;
  email: string;
  username?: string;
 
  // Add other user-specific fields as needed
}




const Dashboard = () => {
 



  const [userData, setUserData] = useState<FirestoreUserData | null>(null);
  const [_error, setError] = useState<string | null>(null);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(sign, async (firebaseUser) => {
      try {
        setError(null);
  
        if (!firebaseUser) {
          setUserData(null);
          return;
        }
  
        // First check the 'users' collection
        const usersQuery = query(
          collection(db, "users"),
          where("uid", "==", firebaseUser.uid)
        );
        const usersSnapshot = await getDocs(usersQuery);
  
        // Then check the 'polja' collection if needed
 
        let firestoreData = {};
        
        if (!usersSnapshot.empty) {
          firestoreData = usersSnapshot.docs[0].data();
        }
        const completeUserData: FirestoreUserData = {
          uid: firebaseUser.uid,
          displayName: firebaseUser.displayName  || "",
          email: firebaseUser.email || "",
          ...firestoreData
        };
  
        setUserData(completeUserData);
  
      } catch (err) {
        console.error("Error fetching user data:", err);
        setError("Failed to load user data");
        
        // Fallback to basic auth data if Firestore fails
        if (firebaseUser) {
          setUserData({
            uid: firebaseUser.uid,
            displayName: firebaseUser.displayName || "User",
            email: firebaseUser.email || "",
          });
        }
      } finally {
        
      }
    });
  
    return () => unsubscribe();
  }, []);
  const [data, setData] = useState<YourDataType[]>([]);
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(sign, async (firebaseUser ) => {
      if (firebaseUser ) {
        // Set loading to true before fetching data
        const fetchData = async () => {
          try {
            const q = query(collection(db, 'result'), where('uid', '==', firebaseUser .uid));
            const querySnapshot = await getDocs(q);
            const dataArray = querySnapshot.docs.map(doc => ({ ...doc.data(), id: doc.id } as YourDataType));
            setData(dataArray);
            console.log(firebaseUser .uid); // Log the user's UID
            console.log(dataArray); // Log the fetched data
          } catch (err) {
            setError(err instanceof Error ? err.message : 'An error occurred');
          } finally {
             // Set loading to false after fetching data
          }
        };

        fetchData();
      } else {
        setData([]); // Clear data if no user is signed in
        // Set loading to false if no user
      }
    });

    return () => unsubscribe(); // Cleanup subscription on unmount
  }, [sign]); 


 
  // Data for charts


  const getGrade = (score: number): string => {
    if (score >= 80) return 'A';
    if (score >= 70) return 'B';
    if (score >= 60) return 'C';
    if (score >= 50) return 'D';
    return 'F';
  };

  const getPerformanceText = (score: number): string => {
    if (score >= 80) return 'Excellent';
    if (score >= 70) return 'Good';
    if (score >= 60) return 'Average';
    if (score >= 50) return 'Needs Improvement';
    return 'Poor';
  };

  const getPerformanceColor = (score: number): string => {
    if (score >= 80) return 'bg-green-500';
    if (score >= 70) return 'bg-blue-500';
    if (score >= 60) return 'bg-yellow-500';
    if (score >= 50) return 'bg-orange-500';
    return 'bg-red-500';
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      {/* Header */}
      <header className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900">Student Result Portal</h1>
            <p className="text-gray-600">Track your academic performance</p>
          </div>
          <div className="flex items-center space-x-4">
            <Link to='/'>
            <svg xmlns="http://www.w3.org/2000/svg" width="30" height="30" fill="currentColor" className="bi bi-arrow-right-short" viewBox="0 0 16 16">
            <path fill-rule="evenodd" d="M4 8a.5.5 0 0 1 .5-.5h5.793L8.146 5.354a.5.5 0 1 1 .708-.708l3 3a.5.5 0 0 1 0 .708l-3 3a.5.5 0 0 1-.708-.708L10.293 8.5H4.5A.5.5 0 0 1 4 8"/>
            </svg>
            </Link>
        </div>
        </div>
      </header>

      {/* Test Selector */}
      

      {/* Main Dashboard Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
        {/* Student Info Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-indigo-100 rounded-lg">
              <FiUser className="text-indigo-600" size={20} />
            </div>
            <h2 className="text-lg font-semibold text-gray-800">Student Information</h2>
          </div>
          <div className="space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Name:</span>
              <span className="font-medium">{userData?.displayName }</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Email:</span>
              <span className="font-medium">{userData?.email}</span>
            </div>
           
          </div>
        </motion.div>
      </div>

    

  

      {/* Detailed Scores Table */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
        className="bg-white rounded-xl shadow-sm overflow-hidden mb-6"
      >
        <div className="p-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Detailed Test Scores</h2>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Subject</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Score</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Grade</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Performance</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {data.map((item,index)=>{
                  return(
                    <>
                      
                        <tr key={index}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 capitalize">
                        {item.subject}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {(item.score/90)*100}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {getGrade((item.score/90)*100)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-2 flex-1 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className={`h-full  ${getPerformanceColor((item.score/90)*100)}  `}
                              
                              style={{ width: `${item.score}%` }}
                            ></div>
                          </div>
                          <span className="ml-2 text-xs font-medium text-gray-500">
                            {getPerformanceText((item.score/90)*100)}
                          </span>
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        
                      {item.timestamp?.toDate().toLocaleString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                          hour12: true
                        })}
                      </td>
                    </tr> 
                    </>
                  )
                })
                }
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;