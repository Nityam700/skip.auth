import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
        },
        email: {
            type: String,
            unique: true
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
        },
        isTwoFactorEnabled: {
            type: Boolean,
            default: true
        },
    }, {
    versionKey: false
}
);

const User = mongoose.models?.User || mongoose.model("User", userSchema);

export default User;