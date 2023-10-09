import React, { useState, useEffect } from 'react';
import { auth, fs } from '../Config/Config';

export const Profile = () => {
  const [userProfile, setUserProfile] = useState(null);

  useEffect(() => {
    // Get the currently signed-in user
    const currentUser = auth.currentUser;

    if (currentUser) {
      // Fetch user profile data from Firestore
      fs.collection('users')
        .doc(currentUser.uid)
        .get()
        .then((doc) => {
          if (doc.exists) {
            setUserProfile(doc.data());
          } else {
            console.log('No such document!');
          }
        })
        .catch((error) => {
          console.error('Error getting document:', error);
        });
    }
  }, []);

  return (
    <div className='container'>
      <br></br>
      <br></br>
      <h1>User Profile</h1>
      <hr></hr>
      {userProfile && (
        <div>
          <p>
            <strong>Full Name:</strong> {userProfile.FullName}
          </p>
          <p>
            <strong>Email:</strong> {userProfile.Email}
          </p>
          {/* Add more profile information as needed */}
        </div>
      )}
      {!userProfile && <p>Loading...</p>}
    </div>
  );
}
