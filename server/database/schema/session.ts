import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
    {
        _id: {
            type: String
        },
        username: {
            type: String
        },
        ipAddress: {
            type: String
        },
        date: {
            type: Date,
            default: Date.now
        }
    }, {
    versionKey: false
}
);

const Session = mongoose.models?.Session || mongoose.model("Session", sessionSchema);

export default Session;