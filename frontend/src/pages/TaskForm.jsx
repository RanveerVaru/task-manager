// src/components/TaskForm.js
import React, { useState, useEffect } from 'react';
import { TextField, Button, Grid, Container, Typography } from '@mui/material';
import axios from 'axios';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const TaskForm = () => {
    const navigate = useNavigate();
    const task = useSelector(state => state.user.task); 
    const [formData, setFormData] = useState({ title: '', discription: '' });
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const isEdit = !!task;

    useEffect(() => {
        // Debugging: Log the task data to ensure it’s being fetched correctly
        console.log('Task data:', task);
        if (task) {
            setFormData({ title: task.title || '', discription: task.discription || '' });
        } else {
            // Reset the form if no task is available (e.g., when creating a new task)
            setFormData({ title: '', discription: '' });
        }
    }, [task]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevData => ({ ...prevData, [name]: value }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError(null);
        setSuccess(null);

        if (!formData.title) {
            setError('Title is required.');
            return;
        }

        try {
            const url = isEdit
                ? `http://localhost:4000/api/tasks/${task._id}`
                : 'http://localhost:4000/api/tasks/';
            const method = isEdit ? 'put' : 'post';
            const response = await axios({
                method,
                url,
                data: formData,
                withCredentials: true,
            });

            if (response.data.success) {
                toast.success(isEdit ? 'Task updated successfully!' : 'Task created successfully!');
                navigate('/');
                setFormData({ title: '', discription: '' });
            }
        } catch (err) {
            toast.error(isEdit ? 'Failed to update task.' : 'Failed to create task.');
            setError(isEdit ? 'Failed to update task.' : 'Failed to create task.');
        }
    };

    return (
        <Container maxWidth="sm" style={{ marginTop: '20px' }}>
            <Typography variant="h4" component="h1" gutterBottom>
                {isEdit ? 'Edit Task' : 'Create Task'}
            </Typography>
            <form onSubmit={handleSubmit}>
                <Grid container spacing={2} direction="column">
                    <Grid item xs={12}>
                        <TextField
                            label="Title"
                            variant="outlined"
                            fullWidth
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            required
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <TextField
                            label="Description"
                            variant="outlined"
                            fullWidth
                            multiline
                            rows={4}
                            name="discription"
                            value={formData.discription}
                            onChange={handleChange}
                        />
                    </Grid>
                    {error && (
                        <Grid item xs={12}>
                            <Typography color="error">{error}</Typography>
                        </Grid>
                    )}
                    {success && (
                        <Grid item xs={12}>
                            <Typography color="success">{success}</Typography>
                        </Grid>
                    )}
                    <Grid item xs={12}>
                        <Button type="submit" variant="contained" color="primary" fullWidth>
                            {isEdit ? 'Update Task' : 'Add Task'}
                        </Button>
                    </Grid>
                </Grid>
            </form>
        </Container>
    );
};

export default TaskForm;
