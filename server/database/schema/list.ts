import mongoose from "mongoose";

const listSchema = new mongoose.Schema(
    {
        _id: {
            type: String
        },
        username: {
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

const List = mongoose.models?.List || mongoose.model("List", listSchema);

export default List;