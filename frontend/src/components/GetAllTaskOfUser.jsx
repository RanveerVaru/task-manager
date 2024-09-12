import React, { useEffect, useState } from "react";
import { Card, CardContent, Typography, Button, Grid, Container, CircularProgress, Box, TextField } from "@mui/material";
import { Edit as EditIcon, Delete as DeleteIcon } from "@mui/icons-material";
import toast from "react-hot-toast";
import axios from "axios";
import { useDispatch } from "react-redux";
import { setTask } from "../redux/userSlice";
import { useNavigate } from "react-router-dom";

const GetAllTaskOfUser = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  const getAllTask = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/api/tasks`, { withCredentials: true });
      if (response.data.success) {
        setTasks(response.data.tasks);
      } else {
        toast.error("Failed to fetch tasks.");
      }
    } catch (error) {
      toast.error("Failed to fetch tasks.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllTask();
  }, [tasks]);

  const handleSearch = async () => {
    try {
      setLoading(true);
      if(searchTerm !== "") return null; 
      const response = await axios.get(`http://localhost:4000/api/tasks/search?title="${searchTerm}"`, { withCredentials: true });
      console.log("srch res : " , response);
      if(response.data.success) {
        setTasks(response.data.tasks);
        setLoading(false);
      }
    } catch (error) {
      toast.error("Failed to search for tasks !!")
    }
  };

  const handleUpdate = (task) => {
    dispatch(setTask(task));
    navigate('/form');
  };

  const handleUpdateTaskCompleted = async (taskId, isComplete) => {
    try {
      const response = await axios.put(
        `http://localhost:4000/api/tasks/${taskId}`,
        { isCompleted: !isComplete },
        { withCredentials: true }
      );
      if (response.data.success) {
        const msg = isComplete ? "Task completed successfully" : "Task Incomplete";
        toast.success(msg);
        getAllTask(); // Refresh tasks
      }
    } catch (error) {
      toast.error("Something went wrong !! try again later");
    }
  };

  const handleDelete = async (taskId) => {
    try {
      const response = await axios.delete(`http://localhost:4000/api/tasks/${taskId}`, { withCredentials: true });

      if (response.data.success) {
        toast.success("Task deleted successfully!");
        getAllTask(); // Refresh tasks
      } else {
        toast.error("Failed to delete task.");
      }
    } catch (error) {
      toast.error("Failed to delete task.");
    }
  };

  if (loading) {
    return (
      <Container
        maxWidth="md"
        style={{
          marginTop: "20px",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "60vh",
        }}
      >
        <CircularProgress />
      </Container>
    );
  }

  return (
    <Container maxWidth="md" style={{ marginTop: "20px" }}>
      <Box mb={2} display="flex" justifyContent="center">
        <TextField
          label="Search Task"
          variant="outlined"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <Button variant="contained" onClick={handleSearch} sx={{ ml: 2 }}>
          Search
        </Button>
      </Box>
      {tasks.length === 0 ? (
        <Box textAlign="center">
          <Typography variant="h6" color="textSecondary">
            No tasks created.
          </Typography>
        </Box>
      ) : (
        <Grid container spacing={3}>
          {tasks.map((task) => (
            <Grid item xs={12} sm={6} key={task._id}>
              <Card variant="outlined" sx={{ boxShadow: 3, borderRadius: 2 }}>
                <CardContent>
                  <Typography variant="h6" component="div" noWrap gutterBottom>
                    {task.title}
                  </Typography>
                  <Typography
                    variant="body2"
                    color="textSecondary"
                    paragraph
                    noWrap
                  >
                    {task.discription}
                  </Typography>
                  <Typography
                    variant="body2"
                    color={task.isCompleted ? "success.main" : "error.main"}
                    gutterBottom
                  >
                    {task.isCompleted ? "Completed" : "Please Complete Your Task!"}
                  </Typography>
                  <Grid container spacing={1} justifyContent="flex-end">
                    <Grid item xs={12} md={4}>
                      <Button
                        variant="contained"
                        color={task.isCompleted ? "success" : "error"}
                        onClick={() =>
                          handleUpdateTaskCompleted(task._id, task.isCompleted)
                        }
                        sx={{ width: "100%" }}
                      >
                        {task.isCompleted ? "Completed" : "Pending"}
                      </Button>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Button
                        variant="outlined"
                        color="primary"
                        onClick={() => handleUpdate(task)}
                        sx={{ width: "100%" }}
                      >
                        <EditIcon />
                      </Button>
                    </Grid>
                    <Grid item xs={12} md={4}>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => handleDelete(task._id)}
                        sx={{ width: "100%" }}
                      >
                        <DeleteIcon />
                      </Button>
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default GetAllTaskOfUser;
