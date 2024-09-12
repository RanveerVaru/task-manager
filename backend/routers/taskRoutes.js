import express from "express"
import { createTask, deleteTask, getAllTasksOfUser, getTasksByTitle, updateTask } from "../controllers/taskController.js";
import { isAuthenticated } from "../middleware/isAuthenticated.js";

const router = express.Router();

router.post('/' ,isAuthenticated ,  createTask);
router.put('/:taskId' ,isAuthenticated , updateTask);
router.get('/' ,isAuthenticated , getAllTasksOfUser);
router.get('/search' , isAuthenticated , getTasksByTitle);
router.delete('/:taskId' , isAuthenticated , deleteTask);


export default router;