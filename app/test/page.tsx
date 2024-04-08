"use client";

import { successToast } from "@/hooks/useToast";
import { sendMail } from "@/server/mail/mail";
import React from "react";

export default function page() {
  async function mail() {
    const email = "iskip.dev@gmail.com";
    const otp = "AEIOU";
    const username = "inityamkr";
    await sendMail(email, otp, username);
    successToast("MAIL SENT");
  }
  return (
    <div>
      <button onClick={mail}>send mail</button>
    </div>
  );
}
