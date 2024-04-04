import { error } from "console";
import mongoose from "mongoose";
export async function connectDatabase() {
    try {
        const DATABASE_URI = process.env.DATABASE_URI;
        if (DATABASE_URI) {
            await mongoose.connect(DATABASE_URI);
            console.log("DATABASE CONNECTED");
        } else {
            console.log("PROVIDE DATABASE URI")
        }
    } catch (error) {
        console.log("FAILED TO CONNECT TO DATABASE" + error)
    }
}