import mongoose from "mongoose";

const TwoFactorSchema = new mongoose.Schema(
    {
        _id: {
            type: String,
        },
        email: {
            type: String
        },
        username: {
            type: String,
        },
        twoFactorCode: {
            type: String
        }
    }, {
    versionKey: false
}
);

const TwoFactor = mongoose.models?.TwoFactor || mongoose.model("TwoFactor", TwoFactorSchema);

export default TwoFactor;