import express from "express"
import { login, logout, register } from "../controllers/userController.js";

const router = express.Router();

router.post("/register" , register);
router.post("/login" , login);
router.get("/" , logout);

export default router;