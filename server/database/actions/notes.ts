"use server"

import Note from "../schema/notes";
import { v4 as uuidv4 } from "uuid";
import { useSession } from "@/hooks/useSession";

export async function addNote(formData: FormData) {
    try {
        const noteId = uuidv4()
        // eslint-disable-next-line react-hooks/rules-of-hooks
        const user = useSession();
        // await connectDatabase();
        // console.log("CONNECTION REQUESTED FROM addNote PAGE");

        const _id = noteId
        const heading = formData.get('heading')
        const subheading = formData.get('subheading')
        const newNote = new Note({
            _id: _id,
            heading: heading,
            owner: user?.username,
            subheading: subheading,
        });
        await newNote.save()
        return {
            noteAdded: "Note added"
        }
    } catch (error) {
        console.log(error);
        return {
            failedToAddNote: "Note added"
        }
    }
}