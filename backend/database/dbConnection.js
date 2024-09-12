import mongoose from 'mongoose';

export const dbConnection = async () => {
    await mongoose.connect(process.env.MONGO_URI)
    .then(() => {
        console.log("connected to database");
    })
    .catch((err) => {
        console.error("Error connecting to database:", err);
    });
}