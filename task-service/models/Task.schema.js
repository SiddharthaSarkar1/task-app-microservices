import mongoose from "mongoose";

const TaskSchema = new mongoose.Schema({
    title: String,
    description: String,
    userId: String,
    createdAt:{
        type: Date,
        default: Date.now
    }
});

const Task = mongoose.model("Task", TaskSchema);

export default Task;