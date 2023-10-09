import React, { useState, useEffect } from "react";
import { auth, fs } from "../Config/Config";
import { useHistory } from "react-router-dom";
import Swal from "sweetalert2";
import { Navbar } from './Navbar'; 

export const Profile = () => {
  const [userProfile, setUserProfile] = useState(null);
  const [editing, setEditing] = useState(false);
  const [editedProfile, setEditedProfile] = useState({});
  const history = useHistory();

  useEffect(() => {
    const currentUser = auth.currentUser;

    if (currentUser) {
      fs.collection("users")
        .doc(currentUser.uid)
        .get()
        .then((doc) => {
          if (doc.exists) {
            setUserProfile(doc.data());
            setEditedProfile(doc.data());
          } else {
            console.log("No such document!");
          }
        })
        .catch((error) => {
          console.error("Error getting document:", error);
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
    fs.collection("users")
      .doc(auth.currentUser.uid)
      .update(editedProfile)
      .then(() => {
        setUserProfile(editedProfile);
        setEditing(false);
      })
      .catch((error) => {
        console.error("Error updating document:", error);
      });
  };

  const deleteAccount = () => {
    Swal.fire({
      title: "Are you sure?",
      text: "This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, delete it!",
    }).then((result) => {
      if (result.isConfirmed) {
        auth.currentUser
          .delete()
          .then(() => {
            history.push("/");
          })
          .catch((error) => {
            console.error("Error deleting account:", error);
          });
      }
    });
  };

  return (
    <div className="container">
      <br />
      <br />
      <h1>User Profile</h1>
      <hr />
      {userProfile && (
        <div>
          {editing ? (
            <div>
              <form>
                <div className="form-group">
                  <label htmlFor="FullName">Full Name:</label>
                  <input
                    type="text"
                    className="form-control"
                    id="FullName"
                    name="FullName"
                    value={editedProfile.FullName}
                    onChange={handleEditChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="Email">Email:</label>
                  <input
                    type="email"
                    className="form-control"
                    id="Email"
                    name="Email"
                    value={editedProfile.Email}
                    onChange={handleEditChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="ContactNumber">Contact Number:</label>
                  <input
                    type="text"
                    className="form-control"
                    id="ContactNumber"
                    name="ContactNumber"
                    value={editedProfile.ContactNumber}
                    onChange={handleEditChange}
                  />
                </div>
                <div className="form-group">
                  <label htmlFor="Address">Address:</label>
                  <input
                    type="text"
                    className="form-control"
                    id="Address"
                    name="Address"
                    value={editedProfile.Address}
                    onChange={handleEditChange}
                  />
                </div>
              </form>

              <button className="btn btn-success" onClick={saveEditedProfile}>
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
                <strong>Contact Number:</strong> {userProfile.ContactNumber}
              </p>
              <p>
                <strong>Address:</strong> {userProfile.Address}
              </p>
              <button className="btn btn-primary" onClick={enableEditing}>
                Edit Profile
              </button>
              <button
                className="btn btn-danger"
                onClick={deleteAccount}
                style={{ marginLeft: "10px" }}
              >
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
