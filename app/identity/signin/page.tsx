import SigninForm from "@/server/authentication/ui/SigninForm";
import Link from "next/link";

export default function SignIn() {
  return (
    <div className="flex gap-3 flex-col justify-center items-center h-dvh">
      <h1 className="text-xl">Hi! sign in your account</h1>
      <SigninForm />
      <Link href={"/identity/create"}>create</Link>
    </div>
  );
}
