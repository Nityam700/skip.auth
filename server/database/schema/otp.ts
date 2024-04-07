import mongoose from "mongoose";

const PendingUserSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
        },
        otp: {
            type: String,
            unique: true,
        },
        username: {
            type: String,
            unique: true,
        },
        email: {
            type: String,
            unique: true,
        },
        password: {
            type: String,
        },
        date: {
            type: Date,
            default: Date.now
        }
    }, {
    versionKey: false
}
);

const PendingUser = mongoose.models?.PendingUser || mongoose.model("PendingUser", PendingUserSchema);

export default PendingUser;