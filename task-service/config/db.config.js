import mongoose from "mongoose";

const connectDB = async (DATABASE_URL) => {
    try {
        const conn = await mongoose.connect(DATABASE_URL);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (error) {
        console.log(`Error connecting MongoDB: ${error.message}`);
        process.exit(1);
    }
}

export default connectDB;