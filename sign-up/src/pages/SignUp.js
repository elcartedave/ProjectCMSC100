import React, { useState } from 'react';
import axios from 'axios';


const SignUp = () => {
    const [signupData, setsignupData] = useState({
        firstName: '',
        lastName: '',
        userType: '',
        email: '',
        password: ''
    });

    const [error, setError] = useState("");

    const handleChange = (e) => {
        setsignupData({ ...signupData, [e.target.name]: e.target.value });
    };
    
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
          const response = await axios.post('http://localhost:3001/signup', signupData);
          console.log(response); 
          if (response && response.data) {
              setError(response.data); 
          } else {
              setError('Signup error: Response or data is undefined');
          }
      } catch (error) {
          setError('Signup error:' + error.response.data);
      }
    };

    return (
        <div>
            <h1>SIGNING UP</h1>
            <form className="container" method="post" action="/signup" onSubmit={handleSubmit}>
                    <div className="form-group">
                    <label htmlFor="fname">First Name</label>
                    <input type="text" className="form-control" id="fname" name="firstName" value={signupData.firstName} onChange={handleChange} required />

                    <label htmlFor="lname">Last Name</label>
                    <input type="text" className="form-control" id="lname" name="lastName" value={signupData.lastName} onChange={handleChange} required />

                    <label htmlFor="userType">User Type</label>
                    <input type="text" className="form-control" id="userType" name="userType" value={signupData.userType} onChange={handleChange} required />

                    <label htmlFor="email">Email</label>
                    <input type="email" className="form-control" id="email" name="email" value={signupData.email} onChange={handleChange} required />

                    <label htmlFor="password">Password</label>
                    <input type="password" className="form-control" id="password" name="password" value={signupData.password} onChange={handleChange} required />
                </div>
                <button type="submit">Submit</button>
            </form>
            <p>{error}</p>
        </div>
    );
};

export default SignUp;