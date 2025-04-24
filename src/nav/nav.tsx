import { useState, useEffect } from 'react';
import { signOut } from 'firebase/auth';
import { sign, db } from '../configure/configure';
import { useNavigate, NavLink } from 'react-router-dom';
import { getDoc, doc } from "firebase/firestore";
import { User } from 'firebase/auth';

interface UserData {
  id: string;
  email: string | null;
  username: string;
}

export const Nav = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<UserData | null>(null);

  const fetchUserData = async (user: User) => {
    try {
      const userDocRef = doc(db, "users", user.uid);
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        const userData = userDocSnap.data();
        setCurrentUser({
          id: user.uid,
          email: user.email,
          username: userData.username || user.displayName || user.email?.split('@')[0] || 'User'
        });
      } else {
        // Fallback to auth info if document doesn't exist
        setCurrentUser({
          id: user.uid,
          email: user.email,
          username: user.displayName || user.email?.split('@')[0] || 'User'
        });
      }
    } catch (error) {
      console.error("Error fetching user data:", error);
      // Fallback to basic auth info if Firestore fails
      if (user) {
        setCurrentUser({
          id: user.uid,
          email: user.email,
          username: user.displayName || user.email?.split('@')[0] || 'User'
        });
      }
    }
  };

  useEffect(() => {
    const unsubscribe = sign.onAuthStateChanged((user) => {
      if (user) {
        fetchUserData(user);
      } else {
        setCurrentUser(null);
      }
    });

    return () => unsubscribe();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(sign);
      navigate('/login');
    } catch (error) {
      console.error('Sign-out failed:', error);
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const navLinks = [
    { path: '/', label: 'Exams' },
    { path: '/dashboard', label: 'Results' },
  ];

  return (
    <header className="bg-gray-900 text-white shadow-md">
      <div className="container mx-auto px-4 lg:px-20 py-4">
        <div className="flex justify-between items-center">
          {/* Logo/Brand can be added here */}

          {/* User Info */}
          <div className="flex items-center space-x-4">
            {currentUser && (
              <>
                <div className="bg-indigo-600 rounded-full w-10 h-10 flex items-center justify-center">
                  <span className="font-medium">
                    {currentUser.username.charAt(0).toUpperCase()}
                  </span>
                </div>
                <span className="font-medium hidden md:block">
                  {currentUser.username}
                </span>
              </>
            )}
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-6">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                className={({ isActive }) => 
                  `px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                    isActive 
                      ? 'bg-indigo-700 text-white' 
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            {currentUser && (
              <button
                onClick={handleLogout}
                className="px-3 py-2 rounded-md text-sm font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
              >
                Logout
              </button>
            )}
          </nav>

          {/* Mobile Menu Button */}
          <div className="md:hidden">
            <button
              onClick={toggleMobileMenu}
              className="text-gray-300 hover:text-white focus:outline-none"
              aria-label="Toggle menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden fixed inset-0 bg-gray-900 bg-opacity-90 z-50">
          <div className="flex justify-end p-4">
            <button
              onClick={closeMobileMenu}
              className="text-white focus:outline-none"
              aria-label="Close menu"
            >
              <svg
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div className="flex flex-col items-center space-y-8 p-8">
            {navLinks.map((link) => (
              <NavLink
                key={link.path}
                to={link.path}
                onClick={closeMobileMenu}
                className={({ isActive }) => 
                  `text-xl px-4 py-2 rounded-md font-medium transition-colors ${
                    isActive 
                      ? 'bg-indigo-700 text-white' 
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  }`
                }
              >
                {link.label}
              </NavLink>
            ))}
            {currentUser && (
              <button
                onClick={() => {
                  handleLogout();
                  closeMobileMenu();
                }}
                className="text-xl px-4 py-2 rounded-md font-medium text-gray-300 hover:bg-gray-700 hover:text-white transition-colors"
              >
                Logout
              </button>
            )}
          </div>
        </div>
      )}
    </header>
  );
};