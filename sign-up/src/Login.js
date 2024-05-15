import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const Login = () => {
    const navigate = useNavigate()
    const [loginData, setloginData] = useState({
        email: '',
        password: ''
    });

    const [error, setError] = useState("");

    const handleChange = (e) => {
        setloginData({ ...loginData, [e.target.name]: e.target.value });
    };
    
    const handleSubmit = async (e) => {
      e.preventDefault();
      try {
          const response = await axios.post('http://localhost:3001/login', loginData);
          console.log(response); 
          if (response && response.data) {
              setError(response.data); 
          } else {
              setError('Signup error: Response or data is undefined');
          }
          navigate('/product-list',{replace:true})
      } catch (error) {
          setError('Signup error');
      }
    };

    return (
        <div>
            <h1>LOGIN</h1>
            <form className="container" method="post" action="/login" onSubmit={handleSubmit}>
                    <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input type="email" className="form-control" id="email" name="email" value={loginData.email} onChange={handleChange} required />

                    <label htmlFor="password">Password</label>
                    <input type="password" className="form-control" id="password" name="password" value={loginData.password} onChange={handleChange} required />
                </div>
                <button type="submit">Submit</button>
            </form>
            <p>{error}</p>
        </div>
    );
};

export default Login;