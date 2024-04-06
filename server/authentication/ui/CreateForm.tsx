"use client";
import { Input } from "@/ui/Input";
import { SubmitButton } from "@/ui/SubmitButton";
import { useRouter } from "next/navigation";
import { identity } from "@/server/authentication/identity";
import { errorToast, successToast } from "@/hooks/useToast";

export default function CreateForm() {
  const router = useRouter();
  async function identityCreate(formData: FormData) {
    const createIdentity = await identity(formData);
    if (createIdentity?.userexists) {
      errorToast(createIdentity.userexists);
    }
    if (createIdentity?.success) {
      successToast(createIdentity.success);
      router.push("/");
    }
    if (createIdentity?.error) {
      errorToast(createIdentity.error);
    }
  }
  return (
    <div className="flex justify-center items-center h-dvh">
      <form
        action={identityCreate}
        className="flex flex-col gap-3 justify-center items-center"
      >
        <Input type="text" defaultValue="CREATE" name="type" hidden />
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
    </div>
  );
}
