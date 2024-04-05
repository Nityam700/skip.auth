"use client";

import { useState } from "react";

interface Button {
  text: String;
  type?: "submit" | "reset" | "button";
  className?: string;
}

export function Button({ text, type, className }: Button) {
  const [isClicked, setClick] = useState(false);
  function pending() {
    setClick(true);
  }
  return (
    <button
      className={`surfaceLight bg-white text-[#48280e] p-3 rounded-xl font-semibold ${className}`}
      type={type}
      onClick={pending}
    >
      {isClicked ? (
        <div className="flex gap-3">wait ..</div>
      ) : (
        <div>{text}</div>
      )}
    </button>
  );
}
