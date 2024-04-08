"use client";
import { Input } from "@/ui/Input";
import { SubmitButton } from "@/ui/SubmitButton";
import { useRouter } from "next/navigation";
import { identity } from "@/server/authentication/identity";
import { errorToast, successToast } from "@/hooks/useToast";
import { useState } from "react";

export default function SignInForm() {
  const [emailSent, setEmailSent] = useState(false);
  const router = useRouter();
  async function identitySignIn(formData: FormData) {
    const signIn = await identity(formData);
    if (signIn?.otpSentForSignIn) {
      successToast(signIn.otpSentForSignIn);
      setEmailSent(true);
    }
    if (signIn?.otpAlreadySent) {
      errorToast(signIn.otpAlreadySent);
      setEmailSent(true);
    }
    if (signIn?.invalidOTP) {
      errorToast(signIn.invalidOTP);
    }
    if (signIn?.failedToSendVerificationOtp) {
      errorToast(signIn.failedToSendVerificationOtp);
    }
    if (signIn?.incorrectPassword) {
      errorToast(signIn.incorrectPassword);
    }
    if (signIn?.noUserFound) {
      errorToast(signIn.noUserFound);
    }
    if (signIn?.signInSuccess) {
      successToast(signIn.signInSuccess);
      router.push("/");
    }
  }
  return (
    <>
      {!emailSent && (
        <form
          action={identitySignIn}
          className="flex flex-col gap-3 justify-center items-center"
        >
          <Input type="text" defaultValue="SIGNIN" name="type" hidden />
          <Input
            type="text"
            defaultValue="IDENTITY_SIGNIN"
            name="signInType"
            hidden
          />
          <Input
            placeholder="username"
            type="username"
            name="username"
            required
          />
          <Input
            placeholder="password"
            type="password"
            name="password"
            required
          />
          <SubmitButton text={"Sign In"} />
        </form>
      )}
      {emailSent && (
        <form
          action={identitySignIn}
          className="flex flex-col gap-3 justify-center items-center"
        >
          <Input type="text" defaultValue="SIGNIN" name="type" hidden />
          <Input
            type="text"
            defaultValue="IDENTITY_VERIFY_SIGNIN"
            name="signInType"
            hidden
          />
          <Input type="otp" placeholder="OTP" name="otp" required />
          <SubmitButton text={"Verify"} />
        </form>
      )}
    </>
  );
}
