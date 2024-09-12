import React from 'react';
import { Button, Container, Typography, Box } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import { useNavigate } from 'react-router-dom';
import GetAllTaskOfUser from './GetAllTaskOfUser';

const Home = () => {
  const navigate = useNavigate();

  return (
    <Container maxWidth="md">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" align="center" gutterBottom>
          Your Tasks
        </Typography>
        <GetAllTaskOfUser />
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Button
            variant="contained"
            color="primary"
            onClick={() => navigate('/form')}
            startIcon={<AddIcon />}
          >
            Add Task
          </Button>
        </Box>
      </Box>
    </Container>
  );
};

export default Home;
