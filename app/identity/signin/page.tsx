import SigninForm from "@/server/authentication/ui/SigninForm";

export default function SignIn() {
  return (
    <div className="flex gap-3 flex-col justify-center items-center h-dvh">
      <SigninForm />
    </div>
  );
}
