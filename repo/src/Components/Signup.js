import React, { useState } from 'react';
import { auth, fs } from '../Config/Config';
import { Link } from 'react-router-dom';
import { useHistory } from 'react-router-dom';

export const Signup = () => {
  const history = useHistory();

  const [fullName, setFullname] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [contactNumber, setContactNumber] = useState('');

  const [errorMsg, setErrorMsg] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  const handleSignup = (e) => {
    e.preventDefault();

    // Check if contactNumber is provided
    if (!contactNumber) {
      setErrorMsg('Please enter a Contact Number.');
      return;
    }

    auth
      .createUserWithEmailAndPassword(email, password)
      .then((credentials) => {
        fs.collection('users')
          .doc(credentials.user.uid)
          .set({
            FullName: fullName,
            Email: email,
            Password: password,
            ContactNumber: contactNumber, // Save contactNumber to Firestore
          })
          .then(() => {
            setSuccessMsg(
              'Signup Successful. You will now automatically get redirected to Login'
            );
            setFullname('');
            setEmail('');
            setPassword('');
            setContactNumber('');
            setErrorMsg('');
            setTimeout(() => {
              setSuccessMsg('');
              history.push('/login');
            }, 3000);
          })
          .catch((error) => setErrorMsg(error.message));
      })
      .catch((error) => {
        setErrorMsg(error.message);
      });
  };

  return (
    <div className='container'>
      <br></br>
      <br></br>
      <h1>Sign Up</h1>
      <hr></hr>
      {successMsg && (
        <>
          <div className='success-msg'>{successMsg}</div>
          <br></br>
        </>
      )}
      <form className='form-group' autoComplete='off' onSubmit={handleSignup}>
        <label>Full Name</label>
        <input
          type='text'
          className='form-control'
          required
          onChange={(e) => setFullname(e.target.value)}
          value={fullName}
        ></input>
        <br></br>
        <label>Email</label>
        <input
          type='email'
          className='form-control'
          required
          onChange={(e) => setEmail(e.target.value)}
          value={email}
        ></input>
        <br></br>
        <label>Password</label>
        <input
          type='password'
          className='form-control'
          required
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        ></input>
        <br></br>
        <label>Contact Number</label>
        <input
          type='text'
          className='form-control'
          required
          onChange={(e) => setContactNumber(e.target.value)}
          value={contactNumber}
        ></input>
        <br></br>
        <div className='btn-box'>
          <span>
            Already have an account? Login
            <Link to='login' className='link'>
              {' '}
              Here
            </Link>
          </span>
          <button type='submit' className='btn btn-success btn-md'>
            SIGN UP
          </button>
        </div>
      </form>
      {errorMsg && (
        <>
          <br></br>
          <div className='error-msg'>{errorMsg}</div>
        </>
      )}
    </div>
  );
};
