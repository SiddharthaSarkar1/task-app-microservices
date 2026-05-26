import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.config.js";
import Task from "./models/Task.schema.js";
import amqp from "amqplib";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3002;
const DATABASE_URL = process.env.DATABASE_URL;

app.use(express.json());

let channel, connection;

async function connectRabbitMQWithRetry(retries = 5, delay = 3000) {
    while (retries > 0) {
        try {
            connection = await amqp.connect("amqp://rabbitmq");
            channel = await connection.createChannel();
            await channel.assertQueue("task_created");
            console.log("Connected to RabbitMQ");
            return;
        } catch (error) {
            console.log(`Error connecting to RabbitMQ: ${error.message}`);
            retries--;
            if (retries > 0) {
                console.log(`Retrying in ${delay / 1000} seconds...`);
                await new Promise(resolve => setTimeout(resolve, delay));
            }
        }
    }
}

app.get("/health", (req, res) => {
    res.status(200).json({ message: "Status OK, Server is running." });
});

app.post('/task', async (req, res) => {
    const { title, description, userId } = req.body;
    try {
        const task = new Task({ title, description, userId });
        await task.save();
        const message = { taskId: task._id, userId, title };
        if(!channel){
            return res.status(503).json({error: "RabbitMQ not connected"});
        }
        channel.sendToQueue("task_created", Buffer.from(JSON.stringify(message)));
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
    connectRabbitMQWithRetry();
    connectDB(DATABASE_URL);
});
