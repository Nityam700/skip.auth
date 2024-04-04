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
        username: {
            type: String
        },
        ipAddress: {
            type: String
        },
        date: {
            type: Date,
            default: Date.now
        },
        isRevoked: {
            type: Boolean,
            default: false
        }
    }, {
    versionKey: false
}
);

const Session = mongoose.models?.Session || mongoose.model("Session", sessionSchema);

export default Session;