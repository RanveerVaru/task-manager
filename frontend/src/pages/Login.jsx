import React, { useState } from 'react';
import { TextField, Button, Typography, Container, Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useDispatch } from 'react-redux';
import { setAuthUser } from '../redux/userSlice.js';

const Login = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('http://localhost:4000/api/users/login', formData, { withCredentials: true });
      console.log(response);
      if (response.data.success) {
        toast.success("Login successful!", { duration: 3000 });
        dispatch(setAuthUser(response.data.user));
        navigate('/'); // Redirect to home page or dashboard after successful login
      } else {
        toast.error("Login failed. Please try again.", { duration: 3000 });
      }
    } catch (error) {
      toast.error("Login failed. Please try again.", { duration: 3000 });
      console.error(error);
    }
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ border: "1px solid", mt: "1rem", padding: "2rem" }}>
      <div style={{ textAlign: 'center' }}>
        <Avatar sx={{ margin: '1rem auto', backgroundColor: '#1976d2' }}>
          {/* Add an icon if needed */}
        </Avatar>
        <Typography component="h1" variant="h5">
          Login
        </Typography>
        <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Email Address"
            name="email"
            value={formData.email}
            onChange={handleChange}
          />
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Password"
            type="password"
            name="password"
            value={formData.password}
            onChange={handleChange}
          />
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            sx={{ marginTop: '1rem' }}
          >
            Login
          </Button>
          <Button
            fullWidth
            variant="text"
            color="secondary"
            sx={{ marginTop: '1rem' }}
            onClick={() => navigate('/register')}
          >
            Don't have an account? Register
          </Button>
        </form>
      </div>
    </Container>
  );
};

export default Login;
