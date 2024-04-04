"use client";
import { Input } from "@/ui/Input";
import { SubmitButton } from "@/ui/SubmitButton";
import { redirect, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { identity } from "@/server/authentication/identity";

export default function SigninForm() {
  const router = useRouter();
  async function identitySignin(formData: FormData) {
    const createIdentity = await identity(formData);
    if (createIdentity?.signInSuccess) {
      toast.success(createIdentity.signInSuccess, {
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
      router.back();
    }
    if (createIdentity?.incorrectPassword) {
      toast.error(createIdentity.incorrectPassword, {
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
    if (createIdentity?.userDosentExists) {
      toast.error(createIdentity.userDosentExists, {
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
        action={identitySignin}
        className="flex flex-col gap-3 justify-center items-center"
      >
        <Input type="text" defaultValue="SIGNIN" name="type" hidden />
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
        <SubmitButton text={"Signin"} />
      </form>
    </div>
  );
}
