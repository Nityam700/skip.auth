import mongoose from "mongoose";
declare global {
    var mongoose: any; // This must be a `var` and not a `let / const`
}

const DATABASE_URI = process.env.DATABASE_URI!;

if (!DATABASE_URI) {
    throw new Error(
        "Please define the DATABASE_URI environment variable inside .env.local",
    );
}

let cached = global.mongoose;

if (!cached) {
    cached = global.mongoose = { conn: null, promise: null };
}

async function connectDatabase() {
    if (cached.conn) {
        console.log("CACHED CONNECTION MONGODB");
        return cached.conn;
    }
    if (!cached.promise) {
        const opts = {
            bufferCommands: false,
        };
        cached.promise = mongoose.connect(DATABASE_URI, opts).then((mongoose) => {
            console.log("NEW CONNECTION MONGODB");

            return mongoose;
        });
    }
    try {
        cached.conn = await cached.promise;
    } catch (e) {
        cached.promise = null;
        throw e;
    }

    return cached.conn;
}

export default connectDatabase;