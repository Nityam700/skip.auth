import mongoose from "mongoose";

const blacklistedTokenSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    username: {
        type: String,
        required: true
    },
    userId: {
        type: String,
    },
    token:
    {
        type: String,
        unique: true,
        required: true
    },
    blcklistedOn: {
        type: Date,
        default: Date.now

    },
}, { versionKey: false });

const BlacklistedToken = mongoose.models?.BlacklistedToken || mongoose.model("BlacklistedToken", blacklistedTokenSchema);

export default BlacklistedToken;
