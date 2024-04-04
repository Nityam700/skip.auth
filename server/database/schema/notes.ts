import mongoose from "mongoose";

const notesSchema = new mongoose.Schema(
    {
        _id: {
            type: String
        },
        heading: {
            type: String
        },
        owner: {
            type: String
        },
        subHeading: {
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

const Note = mongoose.models?.Note || mongoose.model("Note", notesSchema);

export default Note;