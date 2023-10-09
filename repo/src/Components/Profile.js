import React, { useState, useEffect } from 'react';
import { auth, fs } from '../Config/Config';
import { useHistory } from 'react-router-dom';
import Swal from 'sweetalert2';

export const Profile = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({});
  const history = useHistory();
  useEffect(() => {
    const currentUser = auth.currentUser;
    if (currentUser) {
      fs.collection('users')
        .doc(currentUser.uid)
        .get()
        .then((doc) => {
          if (doc.exists) {
            setUserProfile(doc.data());
            setEditedProfile(doc.data());
          } else {
            console.log('No such document!');
          }
        })
        .catch((error) => {
          console.error('Error getting document:', error);
        });
    }
  }, []);
  const enableEditing = () => {
    setEditing(true);
  };
  const handleEditChange = (e) => {
    const { name, value } = e.target;
    setEditedProfile({ ...editedProfile, [name]: value });
  };
  const saveEditedProfile = () => {
    fs.collection('users')
      .doc(auth.currentUser.uid)
      .update(editedProfile)
      .then(() => {
        setUserProfile(editedProfile); // Update the displayed profile data
        setEditing(false); // Disable editing mode
      })
      .catch((error) => {
        console.error('Error updating document:', error);
      });
  };
  const deleteAccount = () => {
    Swal.fire({
      title: 'Are you sure?',
      text: 'This action cannot be undone!',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33',
      confirmButtonText: 'Yes, delete it!',
    }).then((result) => {
      if (result.isConfirmed) {
        auth.currentUser
          .delete()
          .then(() => {
            history.push('/');
          })
          .catch((error) => {
            console.error('Error deleting account:', error);
          });
      }
    });
  };
  return (
    <div className='container'>
      <br></br>
      <br></br>
      <h1>User Profile</h1>
      <hr></hr>
      {userProfile && (
        <div>
          {editing ? (
            <div>
              <p>
                <strong>Full Name:</strong>{' '}
                <input
                  type='text'
                  name='FullName'
                  value={editedProfile.FullName}
                  onChange={handleEditChange}
                />
              </p>
              ContactNumber
              <p>
                <strong>Contact Number:</strong>{' '}
                <input
                  type='text'
                  name='ContactNumber'
                  value={editedProfile.ContactNumber}
                  onChange={handleEditChange}
                />
              </p>

              <p>
                <strong>Email:</strong>{' '}
                <input
                  type='email'
                  name='Email'
                  value={editedProfile.Email}
                  onChange={handleEditChange}
                />
              </p>
              <button className='btn btn-success' onClick={saveEditedProfile}>
                Save
              </button>
            </div>
          ) : (
            <div>
              <p>
                <strong>Full Name:</strong> {userProfile.FullName}
              </p>
              <p>
                <strong>Email:</strong> {userProfile.Email}
              </p>
              <p>
                <strong>Contact Number:</strong>{userProfile.ContactNumber}
              </p>
              <button className='btn btn-primary' onClick={enableEditing}>
                Edit Profile
              </button>
              <button className='btn btn-danger' onClick={deleteAccount}>
                Delete Account
              </button>
            </div>
          )}
        </div>
      )}
      {!userProfile && <p>Loading...</p>}
    </div>
  );
};
