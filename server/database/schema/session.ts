import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
    {
        _id: {
            type: String
        },
        token: {
            type: String,
            unique: true
        },
        userId: {
            type: String
        },
        username: {
            type: String
        },
        ipAddress: {
            type: String
        },
        isRevoked: {
            type: Boolean,
            required: true,
            default: false
        },
        date: {
            type: Date,
            default: Date.now
        },
    }, {
    versionKey: false
}
);

const Session = mongoose.models?.Session || mongoose.model("Session", sessionSchema);

export default Session;