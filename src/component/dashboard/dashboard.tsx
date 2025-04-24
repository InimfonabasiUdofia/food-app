import { useState, useEffect } from 'react';
import { Bar, Radar, Line } from 'react-chartjs-2';
import { db } from '../../configure/configure';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import { motion } from 'framer-motion';
import { FiBook, FiAward, FiTrendingUp, FiPieChart, FiUser } from 'react-icons/fi';
import { Link } from 'react-router-dom';
import { getAuth } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';

// Register ChartJS components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  PointElement,
  LineElement,
  RadialLinearScale,
  Title,
  Tooltip,
  Legend
);

// Type definitions
type SubjectScores = {
  math: number;
  science: number;
  english: number;
  history: number;
  average: number;
};

type TestResult = {
  date: string;
  scores: SubjectScores;
  rank: number;
  totalStudents: number;
  feedback: string;
};

type Student = {
  id: string;
  name: string;
  class: string;
  avatar: string;
  tests: {
    [key: string]: TestResult;
  };
};

type ChartData = {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    backgroundColor: string;
    borderColor: string;
    borderWidth?: number;
    fill?: boolean;
    tension?: number;
  }[];
};

const Dashboard = () => {
  const [student, setStudent] = useState<Student | null>(null);
  const [selectedTest, setSelectedTest] = useState<string>('midterm');
  const [loading, setLoading] = useState<boolean>(true);

  // Mock data - replace with your API call
  useEffect(() => {
    const mockStudent: Student = {
      id: 'STU2023001',
      name: 'Alex Johnson',
      class: '10A',
      avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      tests: {
        midterm: {
          date: '2023-10-15',
          scores: {
            math: 85,
            science: 92,
            english: 78,
            history: 88,
            average: 85.75
          },
          rank: 5,
          totalStudents: 32,
          feedback: "Good performance overall, but needs improvement in English writing skills."
        },
        final: {
          date: '2023-12-20',
          scores: {
            math: 88,
            science: 95,
            english: 85,
            history: 90,
            average: 89.5
          },
          rank: 3,
          totalStudents: 32,
          feedback: "Excellent improvement across all subjects, especially in English."
        },
        quiz1: {
          date: '2023-09-05',
          scores: {
            math: 80,
            science: 85,
            english: 72,
            history: 82,
            average: 79.75
          },
          rank: 8,
          totalStudents: 32,
          feedback: "Good start to the semester, focus on time management during tests."
        }
      }
    };

    setStudent(mockStudent);
    setLoading(false);

    // Real API call example:
    // axios.get<Student>(`/api/students/${studentId}`).then(response => {
    //   setStudent(response.data);
    //   setLoading(false);
    // });
  }, []);
  const {currentUser}=getAuth();
  console.log(currentUser?.email)
//   useEffect((
//       ()=>{
//         const getindividual=async ()=>{
//           try{
//             const docRef = doc(db, "auth", currentUser?.uid);
//             const docSnap = await getDoc(docRef);
//           }catch(e){

//           }
//         }
// }),[])

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
      </div>
    );
  }

  if (!student) {
    return <div className="min-h-screen flex items-center justify-center">No student data found</div>;
  }

  const currentTest = student.tests[selectedTest];

  // Data for charts
  const chartData: Record<string, ChartData> = {
    subjectPerformance: {
      labels: ['Math', 'Science', 'English', 'History'],
      datasets: [{
        label: 'Scores',
        data: [
          currentTest.scores.math,
          currentTest.scores.science,
          currentTest.scores.english,
          currentTest.scores.history
        ],
        backgroundColor: 'rgba(99, 102, 241, 0.7)',
        borderColor: 'rgba(99, 102, 241, 1)',
        borderWidth: 1
      }]
    },
    progressRadar: {
      labels: ['Math', 'Science', 'English', 'History'],
      datasets: [
        {
          label: 'Midterm',
          data: [
            student.tests.midterm.scores.math,
            student.tests.midterm.scores.science,
            student.tests.midterm.scores.english,
            student.tests.midterm.scores.history
          ],
          backgroundColor: 'rgba(99, 102, 241, 0.2)',
          borderColor: 'rgba(99, 102, 241, 1)',
          borderWidth: 2
        },
        {
          label: 'Final',
          data: [
            student.tests.final.scores.math,
            student.tests.final.scores.science,
            student.tests.final.scores.english,
            student.tests.final.scores.history
          ],
          backgroundColor: 'rgba(20, 184, 166, 0.2)',
          borderColor: 'rgba(20, 184, 166, 1)',
          borderWidth: 2
        }
      ]
    },
    trendLine: {
      labels: ['Quiz 1', 'Midterm', 'Final'],
      datasets: [{
        label: 'Average Score Trend',
        data: [
          student.tests.quiz1.scores.average,
          student.tests.midterm.scores.average,
          student.tests.final.scores.average
        ],
        borderColor: 'rgba(236, 72, 153, 1)',
        backgroundColor: 'rgba(236, 72, 153, 0.1)',
        fill: true,
        tension: 0.4
      }]
    }
  };

  const getGrade = (score: number): string => {
    if (score >= 90) return 'A';
    if (score >= 80) return 'B';
    if (score >= 70) return 'C';
    if (score >= 60) return 'D';
    return 'F';
  };

  const getPerformanceText = (score: number): string => {
    if (score >= 90) return 'Excellent';
    if (score >= 80) return 'Good';
    if (score >= 70) return 'Average';
    if (score >= 60) return 'Needs Improvement';
    return 'Poor';
  };

  const getPerformanceColor = (score: number): string => {
    if (score >= 90) return 'bg-green-500';
    if (score >= 80) return 'bg-blue-500';
    if (score >= 70) return 'bg-yellow-500';
    if (score >= 60) return 'bg-orange-500';
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
              <span className="font-medium">{student.name}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Class:</span>
              <span className="font-medium">{student.class}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-600">Student ID:</span>
              <span className="font-medium">{student.id}</span>
            </div>
          </div>
        </motion.div>

        {/* Test Summary Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-blue-100 rounded-lg">
              <FiAward className="text-blue-600" size={20} />
            </div>
            <h2 className="text-lg font-semibold text-gray-800">
              {selectedTest.charAt(0).toUpperCase() + selectedTest.slice(1)} Results
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-indigo-50 p-3 rounded-lg">
              <p className="text-sm text-indigo-600">Average Score</p>
              <p className="text-2xl font-bold text-indigo-700">
                {currentTest.scores.average}%
              </p>
            </div>
            <div className="bg-green-50 p-3 rounded-lg">
              <p className="text-sm text-green-600">Class Rank</p>
              <p className="text-2xl font-bold text-green-700">
                {currentTest.rank}/{currentTest.totalStudents}
              </p>
            </div>
            <div className="bg-purple-50 p-3 rounded-lg">
              <p className="text-sm text-purple-600">Highest Subject</p>
              <p className="text-xl font-bold text-purple-700">
                {Object.entries(currentTest.scores)
                  .filter(([key]) => key !== 'average')
                  .reduce((a, b) => a[1] > b[1] ? a : b)[0]}
              </p>
            </div>
            <div className="bg-amber-50 p-3 rounded-lg">
              <p className="text-sm text-amber-600">Test Date</p>
              <p className="text-xl font-bold text-amber-700">
                {new Date(currentTest.date).toLocaleDateString()}
              </p>
            </div>
          </div>
        </motion.div>

        {/* Teacher Feedback Card */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          className="bg-white rounded-xl shadow-sm p-6"
        >
          <div className="flex items-center space-x-4 mb-4">
            <div className="p-3 bg-teal-100 rounded-lg">
              <FiBook className="text-teal-600" size={20} />
            </div>
            <h2 className="text-lg font-semibold text-gray-800">Teacher's Feedback</h2>
          </div>
          <div className="bg-gray-50 p-4 rounded-lg">
            <p className="text-gray-700 italic">"{currentTest.feedback}"</p>
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
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                {Object.entries(currentTest.scores)
                  .filter(([subject]) => subject !== 'average')
                  .map(([subject, score]) => (
                    <tr key={subject}>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 capitalize">
                        {subject}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {score}%
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                        {getGrade(score)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-2 flex-1 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className={`h-full ${getPerformanceColor(score)}`} 
                              style={{ width: `${score}%` }}
                            ></div>
                          </div>
                          <span className="ml-2 text-xs font-medium text-gray-500">
                            {getPerformanceText(score)}
                          </span>
                        </div>
                      </td>
                    </tr>
                  ))}
              </tbody>
            </table>
          </div>
        </div>
      </motion.div>
    </div>
  );
};

export default Dashboard;