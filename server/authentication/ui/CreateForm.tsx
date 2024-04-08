"use client";
import { Input } from "@/ui/Input";
import { SubmitButton } from "@/ui/SubmitButton";
import { useRouter } from "next/navigation";
import { identity } from "@/server/authentication/identity";
import { errorToast, successToast } from "@/hooks/useToast";
import { useState } from "react";

export default function CreateForm() {
  const [emailSent, setEmailSent] = useState(false);
  const router = useRouter();
  async function identityCreate(formData: FormData) {
    const createIdentity = await identity(formData);
    if (createIdentity?.userexists) {
      errorToast(createIdentity.userexists);
    }
    if (createIdentity?.verificationOtpSent) {
      successToast(createIdentity.verificationOtpSent);
      setEmailSent(true);
    }
    if (createIdentity?.accountCreatedSuccess) {
      successToast(createIdentity.accountCreatedSuccess);
      router.push("/");
    }
    if (createIdentity?.invalidVerificationOTP) {
      errorToast(createIdentity.invalidVerificationOTP);
    }
    if (createIdentity?.failedToSendVerificationOtp) {
      errorToast(createIdentity.failedToSendVerificationOtp);
    }
    if (createIdentity?.verificationOtpAlreadySent) {
      errorToast(createIdentity.verificationOtpAlreadySent);
      setEmailSent(true);
    }
  }
  return (
    <>
      {!emailSent && (
        <form
          action={identityCreate}
          className="flex flex-col gap-3 justify-center items-center"
        >
          <Input type="text" defaultValue="CREATE" name="type" hidden />
          <Input
            type="text"
            defaultValue="IDENTITY_CREATE"
            name="createType"
            hidden
          />
          <Input placeholder="email" type="email" name="email" required />
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
          <SubmitButton text={"Create"} />
        </form>
      )}
      {emailSent && (
        <form
          action={identityCreate}
          className="flex flex-col gap-3 justify-center items-center"
        >
          <Input type="text" defaultValue="CREATE" name="type" hidden />
          <Input
            type="text"
            defaultValue="IDENTITY_VERIFY_CREATE"
            name="createType"
            hidden
          />
          <Input type="otp" placeholder="OTP" name="otp" required />
          <SubmitButton text={"Verify"} />
        </form>
      )}
    </>
  );
}
