import mongoose from "mongoose";
import { User } from "../models/userModel.js";
import { Task } from "../models/taskModel.js"; 

export const createTask = async (req, res, next) => {
    let session;
    try {
        const userId = req.id;
        // console.log("inside createTask " , userId);
        const { title, discription } = req.body; 
        
        if(!title) {
            return res.status(400).json({ success: false, message: "Please provide a task title" });
        }
        const user = await User.findOne({ _id: userId });
        if (!user) {
            return res.status(401).json({ success: false, message: "User not found" });
        }

        // Start a session
        session = await mongoose.startSession();
        session.startTransaction();

        // Create a new task discription
        const newTask = new Task({ title, discription, userId });

        // Associate the task with the user
        user.tasks.push(newTask);
        await user.save({ session });
        await newTask.save({ session });

        // Commit the transaction
        await session.commitTransaction();
        await session.endSession();

        // Respond with success
        return res.status(201).json({ success: true, message: "Task created successfully!!", task: newTask });
    } catch (error) {
        console.error("Error in createTask:", error.message);
        if (session) {
            await session.abortTransaction();
            await session.endSession();
        }
        next(error);
    }
};

export const updateTask = async (req, res, next) => {
    let session;
    try {
        const { taskId } = req.params;
        const { title, discription, isCompleted } = req.body;

        if(!title && !discription && !isCompleted) {
            return res.status(208).json({ success: true, message: " at least update one field" });
        }

        // Start a session
        session = await mongoose.startSession();
        session.startTransaction();

        // Find and update the task
        const task = await Task.findById(taskId).session(session);
        if (!task) {
            return res.status(404).json({ success: false, message: "Task not found" });
        }
        
        task.title = (title) ? title : task.title;
        task.discription = (discription) ? discription : task.discription;
        task.isCompleted = isCompleted !== undefined ? isCompleted : task.isCompleted; // Update only if provided
        await task.save({ session });

        // Commit the transaction
        await session.commitTransaction();
        await session.endSession();

        // Respond with success
        return res.status(200).json({ success: true, message: "Task updated successfully!!", task });
    } catch (error) {
        if (session) {
            await session.abortTransaction();
            await session.endSession();
        }
        next(error);
    }
};

export const deleteTask = async (req, res, next) => {
    let session;
    try {
        const { taskId } = req.params;

        // Start a session
        session = await mongoose.startSession();
        session.startTransaction();

        // Find and delete the task
        const task = await Task.findById(taskId).session(session);
        if (!task) {
            return res.status(404).json({ success: false, message: "Task not found" });
        }

        // Remove task from user tasks
        const user = await User.findOne({ tasks: taskId });
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }
        user.tasks.pull(taskId);
        await user.save({ session });

        await Task.findByIdAndDelete(taskId).session(session);

        // Commit the transaction
        await session.commitTransaction();
        await session.endSession();

        // Respond with success
        return res.status(200).json({ success: true, message: "Task deleted successfully!!" });
    } catch (error) {
        if (session) {
            await session.abortTransaction();
            await session.endSession();
        }
        next(error);
    }
};

export const getTasksByTitle = async (req, res, next) => {
    try {
        const { title } = req.query; // Get the title from the query parameters
        const userId = req.id; // Assuming user ID is available in the request

        // Find the user and populate the tasks array
        console.log("in search");
        const user = await User.findById(userId).populate('tasks');
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        // Filter tasks by title (case-insensitive)
        const filteredTasks = user.tasks.filter(task => {
            task.title.toLowerCase().includes(title.toLowerCase())
            console.log(task.title);
        }
        );

        // If no tasks match the title
        if (filteredTasks.length === 0) {
            return res.status(404).json({ success: false, message: "No tasks found with the given title" });
        }

        // Respond with the filtered tasks
        return res.status(200).json({ success: true, tasks: filteredTasks });
    } catch (error) {
        next(error);
    }
};



export const getAllTasksOfUser = async (req, res, next) => {
    try {
        const userId = req.id;
        const user = await User.findById(userId).populate('tasks');
        if (!user) {
            return res.status(401).json({ success: false, message: "User not found" });
        }

        const tasks = user.tasks;
        return res.status(200).json({ success: true, tasks });
    } catch (error) {
        next(error);
    }
};
