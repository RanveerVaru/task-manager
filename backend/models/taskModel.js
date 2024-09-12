import mongoose from "mongoose";

const taskSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    discription: { // Ensure this matches the rest of your code
        type: String,
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    isCompleted: { // New field
        type: Boolean,
        default: false // Default to false
    }
}, { timestamps: true });

export const Task = mongoose.model("Task", taskSchema);
