"use client";
import { Input } from "@/ui/Input";
import { SubmitButton } from "@/ui/SubmitButton";
import { toast } from "react-hot-toast";
import { addNote } from "../actions/notes";

export default function NoteForm() {
  async function createNote(formData: FormData) {
    const newNote = await addNote(formData);
    if (newNote?.noteAdded) {
      toast.success(newNote.noteAdded, {
        duration: 5000,
        style: {
          border: "1px solid #713200",
          padding: "12px",
          color: "#713200",
        },
        iconTheme: {
          primary: "#713200",
          secondary: "#FFFAEE",
        },
      });
    }

    if (newNote?.failedToAddNote) {
      toast.error(newNote.failedToAddNote, {
        duration: 5000,
        style: {
          border: "1px solid #713200",
          padding: "12px",
          color: "#713200",
        },
        iconTheme: {
          primary: "#713200",
          secondary: "#FFFAEE",
        },
      });
    }
  }
  return (
    <div className="flex justify-center items-center h-dvh">
      <form
        action={createNote}
        className="flex flex-col gap-3 justify-center items-center"
      >
        <Input placeholder="heading" type="text" name="heading" required />
        <Input
          placeholder="sub heading"
          type="text"
          name="subheading"
          required
        />
        <SubmitButton text={"Create"} />
      </form>
    </div>
  );
}
