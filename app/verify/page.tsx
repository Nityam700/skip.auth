"use client";
import { Input } from "@/ui/Input";
import { SubmitButton } from "@/ui/SubmitButton";
import { useRouter } from "next/navigation";
import { identity } from "@/server/authentication/identity";
import { errorToast, successToast } from "@/hooks/useToast";

export default function SigninForm() {
  const router = useRouter();
  async function identitySignin(formData: FormData) {
    const createIdentity = await identity(formData);
    if (createIdentity?.incorrectOTP) {
      errorToast(createIdentity.incorrectOTP);
    }
    if (createIdentity?.signInEmailVerified) {
      successToast(createIdentity.signInEmailVerified);
      router.push("/");
    }
  }
  return (
    <div className="flex justify-center items-center h-dvh">
      <form
        action={identitySignin}
        className="flex flex-col gap-3 justify-center items-center"
      >
        <Input type="text" defaultValue="SIGNIN" name="type" hidden />
        <Input
          type="text"
          defaultValue="SIGNIN_VERIFY"
          name="signInType"
          hidden
        />
        <Input type="otp" placeholder="OTP" name="otp" required />
        <SubmitButton text={"Verify"} />
      </form>
    </div>
  );
}
