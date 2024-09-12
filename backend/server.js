import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { dbConnection } from "./database/dbConnection.js";
import userRoutes from "./routers/userRoutes.js";
import taskRoutes from "./routers/taskRoutes.js";
import cookieParser from "cookie-parser";
import path from "path"
dotenv.config({ path: './config/config.env' });

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());


app.use(cors({
    origin: "*",
    credentials: true,
}));

const _dirname = path.dirname("");
const buildpath = path.join(_dirname , "../frontend/build");
app.use(express.static(buildpath));



app.use("/api/users", userRoutes);
app.use("/api/tasks", taskRoutes);

dbConnection();

// Error handling middleware
app.use((err, req, res, next) => {
    const message = err.message || "Internal Server Error";
    const status = err.status || 500;
    const success = false;

    return res.status(status).json({ message, success });
});

const PORT = process.env.PORT || 4000;

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
