import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
        },
        username: {
            type: String,
            unique: true
        },
        password: {
            type: String,
            unique: true,
        },
        role: {
            type: String,
            enum: ['BOSS', 'USER'],
            default: 'USER'
        },
        date: {
            type: Date,
            default: Date.now
        }
    }, {
    versionKey: false
}
);

const User = mongoose.models?.User || mongoose.model("User", userSchema);

export default User;