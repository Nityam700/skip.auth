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
    if (createIdentity?.signInSuccess) {
      successToast(createIdentity.signInSuccess);
      router.push("/");
    }
    if (createIdentity?.incorrectPassword) {
      errorToast(createIdentity.incorrectPassword);
    }
    if (createIdentity?.userDosentExists) {
      errorToast(createIdentity.userDosentExists);
    }
  }
  return (
    <form
      action={identitySignin}
      className="flex flex-col gap-3 justify-center items-center"
    >
      <p className="text-xl">Hi! sign in to continue</p>
      <Input type="text" defaultValue="SIGNIN" name="type" hidden />
      <Input placeholder="username" type="username" name="username" required />
      <Input placeholder="password" type="password" name="password" required />
      <SubmitButton text={"Signin"} />
    </form>
  );
}
