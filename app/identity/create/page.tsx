import CreateForm from "@/server/authentication/ui/CreateForm";
import Link from "next/link";

export default function IdentityCreate() {
  return (
    <div className="flex justify-center flex-col gap-3 items-center h-dvh">
      <h1 className="text-xl">Hi! create your account</h1>
      <CreateForm />
      <Link href={"/identity/signin"}>signin</Link>
    </div>
  );
}
