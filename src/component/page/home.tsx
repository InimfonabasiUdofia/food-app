import { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Nav } from '../../nav/nav';

type Category = {
  id: number;
  icon: JSX.Element;
  name: string;
  questionCount: number;
};

const Home = () => {
  const [selectedCategory, setSelectedCategory] = useState<number>(0);
  const [expandedSidebar, setExpandedSidebar] = useState<boolean>(false);

  const categories: Category[] = [
    {
      id: 1,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" viewBox="0 0 16 16">
          <path d="M2.52 3.515A2.5 2.5 0 0 1 4.82 2h6.362c1 0 1.904.596 2.298 1.515l.792 1.848c.075.175.21.319.38.404.5.25.855.715.965 1.262l.335 1.679q.05.242.049.49v.413c0 .814-.39 1.543-1 1.997V13.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-1.338c-1.292.048-2.745.088-4 .088s-2.708-.04-4-.088V13.5a.5.5 0 0 1-.5.5h-2a.5.5 0 0 1-.5-.5v-1.892c-.61-.454-1-1.183-1-1.997v-.413a2.5 2.5 0 0 1 .049-.49l.335-1.68c.11-.546.465-1.012.964-1.261a.8.8 0 0 0 .381-.404l.792-1.848ZM3 10a1 1 0 1 0 0-2 1 1 0 0 0 0 2m10 0a1 1 0 1 0 0-2 1 1 0 0 0 0 2M6 8a1 1 0 0 0 0 2h4a1 1 0 1 0 0-2zM2.906 5.189a.51.51 0 0 0 .497.731c.91-.073 3.35-.17 4.597-.17s3.688.097 4.597.17a.51.51 0 0 0 .497-.731l-.956-1.913A.5.5 0 0 0 11.691 3H4.309a.5.5 0 0 0-.447.276L2.906 5.19Z"/>
        </svg>
      ),
      name: 'Cars',
      questionCount: 28
    },
    {
      id: 2,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" viewBox="0 0 16 16">
          <path d="M8 3a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3"/>
          <path d="m5.93 6.704-.846 8.451a.768.768 0 0 0 1.523.203l.81-4.865a.59.59 0 0 1 1.165 0l.81 4.865a.768.768 0 0 0 1.523-.203l-.845-8.451A1.5 1.5 0 0 1 10.5 5.5L13 2.284a.796.796 0 0 0-1.239-.998L9.634 3.84a.7.7 0 0 1-.33.235c-.23.074-.665.176-1.304.176-.64 0-1.074-.102-1.305-.176a.7.7 0 0 1-.329-.235L4.239 1.286a.796.796 0 0 0-1.24.998l2.5 3.216c.317.316.475.758.43 1.204Z"/>
        </svg>
      ),
      name: 'Celebrity',
      questionCount: 26
    },
    {
      id: 3,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" viewBox="0 0 16 16">
          <path d="M12.433 10.07C14.133 10.585 16 11.15 16 8a8 8 0 1 0-8 8c1.996 0 1.826-1.504 1.649-3.08-.124-1.101-.252-2.237.351-2.92.465-.527 1.42-.237 2.433.07M8 5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3m4.5 3a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3M5 6.5a1.5 1.5 0 1 1-3 0 1.5 1.5 0 0 1 3 0m.5 6.5a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3"/>
        </svg>
      ),
      name: 'Art',
      questionCount: 25
    },
    {
      id: 4,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" viewBox="0 0 16 16">
          <path d="M8 1a1 1 0 0 1 1-1h6a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1H9a1 1 0 0 1-1-1zm1 13.5a.5.5 0 1 0 1 0 .5.5 0 0 0-1 0m2 0a.5.5 0 1 0 1 0 .5.5 0 0 0-1 0M9.5 1a.5.5 0 0 0 0 1h5a.5.5 0 0 0 0-1zM9 3.5a.5.5 0 0 0 .5.5h5a.5.5 0 0 0 0-1h-5a.5.5 0 0 0-.5.5M1.5 2A1.5 1.5 0 0 0 0 3.5v7A1.5 1.5 0 0 0 1.5 12H6v2h-.5a.5.5 0 0 0 0 1H7v-4H1.5a.5.5 0 0 1-.5-.5v-7a.5.5 0 0 1 .5-.5H7V2z"/>
        </svg>
      ),
      name: 'Computer',
      questionCount: 11
    },
    {
      id: 5,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" viewBox="0 0 16 16">
          <path d="M2.5 13.5A.5.5 0 0 1 3 13h10a.5.5 0 0 1 0 1H3a.5.5 0 0 1-.5-.5M13.991 3l.024.001a1.5 1.5 0 0 1 .538.143.76.76 0 0 1 .302.254c.067.1.145.277.145.602v5.991l-.001.024a1.5 1.5 0 0 1-.143.538.76.76 0 0 1-.254.302c-.1.067-.277.145-.602.145H2.009l-.024-.001a1.5 1.5 0 0 1-.538-.143.76.76 0 0 1-.302-.254C1.078 10.502 1 10.325 1 10V4.009l.001-.024a1.5 1.5 0 0 1 .143-.538.76.76 0 0 1 .254-.302C1.498 3.078 1.675 3 2 3zM14 2H2C0 2 0 4 0 4v6c0 2 2 2 2 2h12c2 0 2-2 2-2V4c0-2-2-2-2-2"/>
        </svg>
      ),
      name: 'Television',
      questionCount: 14
    },
    {
      id: 6,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" viewBox="0 0 16 16">
          <path d="M12 13c0 1.105-1.12 2-2.5 2S7 14.105 7 13s1.12-2 2.5-2 2.5.895 2.5 2"/>
          <path fillRule="evenodd" d="M12 3v10h-1V3z"/>
          <path d="M11 2.82a1 1 0 0 1 .804-.98l3-.6A1 1 0 0 1 16 2.22V4l-5 1z"/>
          <path fillRule="evenodd" d="M0 11.5a.5.5 0 0 1 .5-.5H4a.5.5 0 0 1 0 1H.5a.5.5 0 0 1-.5-.5m0-4A.5.5 0 0 1 .5 7H8a.5.5 0 0 1 0 1H.5a.5.5 0 0 1-.5-.5m0-4A.5.5 0 0 1 .5 3H8a.5.5 0 0 1 0 1H.5a.5.5 0 0 1-.5-.5"/>
        </svg>
      ),
      name: 'Music',
      questionCount: 11
    },
    {
      id: 7,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" viewBox="0 0 16 16">
          <path d="M16 8c0 3.866-3.582 7-8 7a9 9 0 0 1-2.347-.306c-.584.296-1.925.864-4.181 1.234-.2.032-.352-.176-.273-.362.354-.836.674-1.95.77-2.966C.744 11.37 0 9.76 0 8c0-3.866 3.582-7 8-7s8 3.134 8 7M4.5 5a.5.5 0 0 0 0 1h7a.5.5 0 0 0 0-1zm0 2.5a.5.5 0 0 0 0 1h7a.5.5 0 0 0 0-1zm0 2.5a.5.5 0 0 0 0 1h4a.5.5 0 0 0 0-1z"/>
        </svg>
      ),
      name: 'Cartoon',
      questionCount: 32
    },
    {
      id: 8,
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" width="25" height="25" fill="currentColor" viewBox="0 0 16 16">
          <path d="M1 0 0 1l2.2 3.081a1 1 0 0 0 .815.419h.07a1 1 0 0 1 .708.293l2.675 2.675-2.617 2.654A3.003 3.003 0 0 0 0 13a3 3 0 1 0 5.878-.851l2.654-2.617.968.968-.305.914a1 1 0 0 0 .242 1.023l3.27 3.27a.997.997 0 0 0 1.414 0l1.586-1.586a.997.997 0 0 0 0-1.414l-3.27-3.27a1 1 0 0 0-1.023-.242L10.5 9.5l-.96-.96 2.68-2.643A3.005 3.005 0 0 0 16 3q0-.405-.102-.777l-2.14 2.141L12 4l-.364-1.757L13.777.102a3 3 0 0 0-3.675 3.68L7.462 6.46 4.793 3.793a1 1 0 0 1-.293-.707v-.071a1 1 0 0 0-.419-.814zm9.646 10.646a.5.5 0 0 1 .708 0l2.914 2.915a.5.5 0 0 1-.707.707l-2.915-2.914a.5.5 0 0 1 0-.708M3 11l.471.242.529.026.287.445.445.287.026.529L5 13l-.242.471-.026.529-.445.287-.287.445-.529.026L3 15l-.471-.242L2 14.732l-.287-.445L1.268 14l-.026-.529L1 13l.242-.471.026-.529.445-.287.287-.445.529-.026z"/>
        </svg>
      ),
      name: 'Gadget',
      questionCount: 30
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="index">
        <Nav />
      </div>
      
      <div className="">
        {/* Sidebar */}
        <div className='absolute'>
  
        <div className={`bg-white shadow-lg transition-all fixed  nav duration-300 ease-in-out  `}>
          <div className="flex flex-col  py-6 h-full">
            <div className="flex flex-col  space-y-2 flex-grow">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => setSelectedCategory(category.id - 1)}
                  className={`flex  p-2 rounded-lg transition-colors duration-200 ${
                    selectedCategory === category.id - 1
                      ? 'bg-indigo-100 text-indigo-600'
                      : 'text-gray-600 hover:bg-gray-100'
                  }`}
                >
                  <span className="flex-shrink-0">{category.icon}</span>
                  {expandedSidebar && (
                    <span className="ml-3 font-medium">{category.name}</span>
                  )}
                </button>
              ))}
            </div>
            
            <button
              onClick={() => setExpandedSidebar(!expandedSidebar)}
              className="mt-auto p-2 text-gray-500 hover:text-indigo-600 transition-colors"
            >
              {expandedSidebar ? (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M6 12.5a.5.5 0 0 0 .5.5h8a.5.5 0 0 0 .5-.5v-9a.5.5 0 0 0-.5-.5h-8a.5.5 0 0 0-.5.5v2a.5.5 0 0 1-1 0v-2A1.5 1.5 0 0 1 6.5 2h8A1.5 1.5 0 0 1 16 3.5v9a1.5 1.5 0 0 1-1.5 1.5h-8A1.5 1.5 0 0 1 5 12.5v-2a.5.5 0 0 1 1 0z"/>
                  <path fillRule="evenodd" d="M.146 8.354a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L1.707 7.5H10.5a.5.5 0 0 1 0 1H1.707l2.147 2.146a.5.5 0 0 1-.708.708z"/>
                </svg>
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="currentColor" viewBox="0 0 16 16">
                  <path fillRule="evenodd" d="M10 12.5a.5.5 0 0 1-.5.5h-8a.5.5 0 0 1-.5-.5v-9a.5.5 0 0 1 .5-.5h8a.5.5 0 0 1 .5.5v2a.5.5 0 0 0 1 0v-2A1.5 1.5 0 0 0 9.5 2h-8A1.5 1.5 0 0 0 0 3.5v9A1.5 1.5 0 0 0 1.5 14h8a1.5 1.5 0 0 0 1.5-1.5v-2a.5.5 0 0 0-1 0z"/>
                  <path fillRule="evenodd" d="M15.854 8.354a.5.5 0 0 0 0-.708l-3-3a.5.5 0 0 0-.708.708L14.293 7.5H5.5a.5.5 0 0 0 0 1h8.793l-2.147 2.146a.5.5 0 0 0 .708.708z"/>
                </svg>
              )}
            </button>
          </div>
        </div>
        </div>

        {/* Main Content */}
        <div className={`flex-grow transition-all duration-300 ease-in-out ml-20`}>
          <div className="max-w-4xl mx-auto py-12 px-6">
            <div className="bg-white rounded-xl shadow-md overflow-hidden">
              <div className="p-8">
                <div className="flex flex-col md:flex-row">
                  <div className="md:w-2/3 pr-8">
                    <h1 className="text-3xl font-bold text-indigo-600 mb-4">Welcome to Your Exam Preparation!</h1>
                    <p className="text-gray-600 mb-6">You're just a few steps away from showcasing your knowledge in {categories[selectedCategory].name}.</p>

                    <div className="space-y-6">
                      <div>
                        <h2 className="text-xl font-semibold text-indigo-500 mb-2">Exam Details</h2>
                        <div className="space-y-2">
                          <p className="text-gray-700"><span className="font-medium">Subject:</span> {categories[selectedCategory].name}</p>
                          <p className="text-gray-700"><span className="font-medium">Questions:</span> 30</p>
                          <p className="text-gray-700"><span className="font-medium">Duration:</span> 20 Minutes</p>
                        </div>
                      </div>

                      <div>
                        <h2 className="text-xl font-semibold text-indigo-500 mb-2">Instructions</h2>
                        <ul className="list-disc pl-5 space-y-2 text-gray-700">
                          <li>Ensure your device is charged and has a stable internet connection</li>
                          <li>Pick your course from the sidebar</li>
                          <li>Read each question carefully before answering</li>
                          <li>You cannot go back to previous questions once answered</li>
                        </ul>
                      </div>

                      <div>
                        <h2 className="text-xl font-semibold text-indigo-500 mb-2">Preparation Tips</h2>
                        <ul className="list-disc pl-5 space-y-2 text-gray-700">
                          <li>Review your notes and practice questions</li>
                          <li>Take breaks to avoid burnout</li>
                          <li>Practice relaxation techniques to reduce anxiety</li>
                          <li>Get a good night's sleep before the exam</li>
                        </ul>
                      </div>
                    </div>
                  </div>

                  <div className="md:w-1/3 mt-8 md:mt-0">
                    <div className="bg-indigo-50 rounded-lg p-6 h-full">
                      <div className="flex flex-col items-center">
                        <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center mb-4">
                          {categories[selectedCategory].icon}
                        </div>
                        <h3 className="text-xl font-semibold text-indigo-700 mb-2">{categories[selectedCategory].name} Quiz</h3>
                        <p className="text-gray-600 text-center mb-6">Test your knowledge with 30 carefully crafted questions</p>
                        
                        <NavLink 
                          to={`./exams/${categories[selectedCategory].questionCount}/${categories[selectedCategory].name}`}
                          className="w-full"
                        >
                          <button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-medium py-3 px-6 rounded-lg transition-colors duration-200">
                            Start Exam Now
                          </button>
                        </NavLink>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-12 pt-6 border-t border-gray-200">
                  <h2 className="text-xl font-semibold text-indigo-500 mb-4">Need Help?</h2>
                  <p className="text-gray-700 mb-4">If you have any questions or encounter technical issues, please contact our support team.</p>
                  <a 
                    href="mailto:inimfonabasi2323@gmail.com" 
                    className="text-indigo-600 hover:text-indigo-800 font-medium"
                  >
                    inimfonabasi2323@gmail.com
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Home;