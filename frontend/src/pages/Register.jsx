import React, { useState } from 'react';
import { TextField, Button, Typography, Container, Avatar } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import toast from 'react-hot-toast';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: ''
  });
  const navigate = useNavigate();

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
      const response = await axios.post('http://localhost:4000/api/users/register', formData, {
        withCredentials: true,
      });
      if (response.data.success) {
        toast.success('Registration successful!', { duration: 3000 });
        navigate('/login'); // Redirect to login page after successful registration
      } else {
        toast.error('Registration failed. Please try again.', { duration: 3000 });
      }
    } catch (error) {
      toast.error('Registration failed. Please try again.', { duration: 3000 });
      console.error(error);
    }
  };

  return (
    <Container component="main" maxWidth="xs" sx={{ border: '1px solid', mt: '1rem', padding: '2rem' }}>
      <div style={{ textAlign: 'center' }}>
        <Avatar sx={{ margin: '1rem auto', backgroundColor: '#1976d2' }}>
          {/* Add an icon if needed */}
        </Avatar>
        <Typography component="h1" variant="h5">
          Register
        </Typography>
        <form onSubmit={handleSubmit} style={{ marginTop: '1rem' }}>
          <TextField
            variant="outlined"
            margin="normal"
            required
            fullWidth
            label="Username"
            name="username"
            value={formData.username}
            onChange={handleChange}
            autoFocus
          />
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
            Register
          </Button>
          <Button
            fullWidth
            variant="text"
            color="secondary"
            sx={{ marginTop: '1rem' }}
            onClick={() => navigate('/login')}
          >
            Already have an account? Login
          </Button>
        </form>
      </div>
    </Container>
  );
};

export default Register;
