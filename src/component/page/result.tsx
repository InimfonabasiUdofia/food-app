
import { useParams } from 'react-router-dom';
import { db } from '../../configure/configure';
import {  getDoc, doc, setDoc } from "firebase/firestore";
import { sign } from '../../configure/configure'; // Use Firebase auth instead of `sign`
import { useEffect, useState } from 'react';
import { Nav } from '../../nav/nav';
import loadingimg from '/blackspin.svg'

interface User {
  id: string;
  email: string;
  username: string;
}

const Result = () => {
  const { score } = useParams();
  const [userauth, setUserData] = useState<User | null>(null); // Initialize as null
  const [loading, setLoading] = useState(true); // Add a loading state

  const fetchData = async () => {
    const currentUser = sign.currentUser; // Get the current user from Firebase auth

    if (!currentUser) {
      setLoading(false);
      return; // Don't proceed if there's no logged-in user
    }

    try {
      // Reference the document for the current user
      const userDocRef = doc(db, "auth", currentUser.uid); // Assuming the document ID is the user's UID
      const userDocSnap = await getDoc(userDocRef);

      if (userDocSnap.exists()) {
        // If the document exists, set the data
        setUserData({ id: userDocSnap.id, ...userDocSnap.data() } as User);
      } else {
        console.log('No such document!');
        // Create a new document if it doesn't exist
        await setDoc(userDocRef, {
          userId: currentUser.uid,
          email: currentUser.email,
          username: currentUser.displayName || "Unknown",
          });
        console.log("New document created!");
        fetchData(); // Fetch the newly created document
      }
    } catch (error) {
      console.error("Error fetching data: ", error);
    } finally {
      setLoading(false); // Set loading to false after fetching
    }
  };

  useEffect(() => {
    fetchData();
  }, [sign.currentUser]); // Use auth.currentUser as a dependency

  // Convert score to a number and calculate the percentage
  const sum = score ? (Number(score) / 90) * 100 : 0; // Default to 0 if score is not present

  if (loading) {
    return  <div className="flex justify-center  self-center mt-20">
              <img className='h-[80px]' src={loadingimg} alt="" />
          </div>; // Show a loading message
  }

  return (
    <>
    <Nav></Nav>
      <div className="container mx-auto grid lg:grid-cols-3 sm:px-1 lg:px-4 md:px-20">
        <div className=""></div>
        <div className="text-center pt-5    px-6">
          <p>{userauth?.username}</p>
          <progress id="file" value={sum} max="100"> </progress>
          <div className='text-center pt-2'>{sum.toFixed(0)}%</div>
        </div>
      
      </div>
    </>
  );
};

export default Result;