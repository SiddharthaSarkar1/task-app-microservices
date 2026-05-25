import express from "express";
import dotenv from "dotenv";
import connectDB from "./config/db.config.js";
import User from "./models/User.schema.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;
const DATABASE_URL = process.env.DATABASE_URL;

app.use(express.json());

app.get("/health", (req, res) => {
    res.status(200).json({ message: "Status OK, Server is running." });
});

app.post('/user', async (req, res) => {
    const { name, email } = req.body;
    try {
        const user = new User({ name, email });
        await user.save();
        res.status(201).json(user);
    } catch (error) {
        console.log('Error while creating user', error.message);
        res.status(500).json("Internal Server Error");
    }
});

app.get('/users', async (req, res) => {
    try {
        const users = await User.find();
        res.status(200).json(users);
    } catch (error) {
        console.log('Error while fetching users', error.message);
        res.status(500).json("Internal Server Error");
    }
});

app.get('/user/:id', async (req, res) => {
    const userId = req.params.id;
    try {
        const user = await User.findById(userId);
        if (!user) return res.status(404).json("User not found");
        res.status(200).json(user);
    } catch (error) {
        console.log('Error while fetching an user', error.message);
        res.status(500).json("Internal Server Error");
    }
});

app.listen(PORT, () => {
    console.log(`Server is running on port http://localhost:${PORT}`);
    connectDB(DATABASE_URL);
});
