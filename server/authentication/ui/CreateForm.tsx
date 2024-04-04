"use client";
import { Input } from "@/ui/Input";
import { SubmitButton } from "@/ui/SubmitButton";
import { redirect } from "next/navigation";
import { toast } from "react-hot-toast";
import { identity } from "@/server/authentication/identity";

export default function CreateForm() {
  async function identityCreate(formData: FormData) {
    const createIdentity = await identity(formData);
    if (createIdentity?.userexists) {
      toast.error(createIdentity.userexists, {
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
    if (createIdentity?.success) {
      toast.success(createIdentity.success, {
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
      redirect("/");
    }
    if (createIdentity?.error) {
      toast.error(createIdentity.error, {
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
