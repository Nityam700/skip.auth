"use server"

import { connectDatabase } from "@/server/database/connect"
import Note from "../schema/notes";
import { v4 as uuidv4 } from "uuid";
import { getBrowserCookie } from "@/server/cookie/session";

export async function addNote(formData: FormData) {
    try {
        const noteId = uuidv4()
        const session = getBrowserCookie();
        const username = session?.username
        await connectDatabase();
        console.log("CONNECTION REQUESTED FROM addNote PAGE");

        const _id = noteId
        const heading = formData.get('heading')
        const subheading = formData.get('subheading')
        const newNote = new Note({
            _id: _id,
            heading: heading,
            owner: username,
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