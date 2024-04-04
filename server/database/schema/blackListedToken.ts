import mongoose from "mongoose";

const blacklistedTokenSchema = new mongoose.Schema({
    token:
    {
        type: String,
        unique: true,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now

    },
});

const BlacklistedToken = mongoose.models?.BlacklistedToken || mongoose.model("BlacklistedToken", blacklistedTokenSchema);

export default BlacklistedToken;
