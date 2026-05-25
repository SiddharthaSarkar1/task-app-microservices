import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.config.js";
import Task from "./models/Task.schema.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;
const DATABASE_URL = process.env.DATABASE_URL;

app.use(express.json());

app.get("/health", (req, res) => {
    res.status(200).json({ message: "Status OK, Server is running." });
});

app.post('/task', async (req, res) => {
    const { title, description, userId } = req.body;
    try {
        const task = new Task({ title, description, userId });
        await task.save();
        res.status(201).json(task);
    } catch (error) {
        console.log('Error while creating task', error.message);
        res.status(500).json("Internal Server Error");
    }
});

app.get('/tasks', async (req, res) => {
    try {
        const tasks = await Task.find();
        res.status(200).json(tasks);
    } catch (error) {
        console.log('Error while fetching tasks', error.message);
        res.status(500).json("Internal Server Error");
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
    connectDB(DATABASE_URL);
});
