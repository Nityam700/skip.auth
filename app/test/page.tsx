"use client";
import { Input } from "@/ui/Input";
import { SubmitButton } from "@/ui/SubmitButton";
import { useRouter } from "next/navigation";
import { identity } from "@/server/authentication/identity";
import { errorToast, successToast } from "@/hooks/useToast";
import { useState } from "react";

export default function CreateForm() {
  const [otp, setOtp] = useState(false);
  //   const router = useRouter();
  async function identityCreate(formData: FormData) {
    // const createIdentity = await identity(formData);
    // if (createIdentity?.userexists) {
    //   errorToast(createIdentity.userexists);
    // }
    // if (createIdentity?.success) {
    //   successToast(createIdentity.success);
    //   router.push("/");
    // }
    // if (createIdentity?.error) {
    //   errorToast(createIdentity.error);
    // }
    setOtp(true);
  }
  return (
    <div className="flex flex-col gap-2 justify-center items-center h-dvh">
      {!otp && (
        <form
          action={identityCreate}
          className="flex flex-col gap-3 justify-center items-center"
        >
          <Input type="text" defaultValue="CREATE" name="type" hidden />
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
      {otp && (
        <form className="flex flex-col gap-3 justify-center items-center">
          <Input type="text" name="otp" placeholder="otp" />
          <SubmitButton text={"Verify Email"} />
        </form>
      )}
    </div>
  );
}
