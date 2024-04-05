"use client";

import { useFormStatus } from "react-dom";

export function SubmitButton({ text }: { text: String }) {
  const { pending } = useFormStatus();

  return (
    <button
      className="surfaceLight bg-white font-semibold text-[#48280e] p-3 rounded-xl w-full"
      type="submit"
      disabled={pending}
    >
      {pending ? "wait..." : <div>{text}</div>}
    </button>
  );
}
