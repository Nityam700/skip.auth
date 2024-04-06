"use client";
import { useRouter } from "next/navigation";
import { identity } from "@/server/authentication/identity";
import { SubmitButton } from "@/ui/SubmitButton";
import { errorToast, successToast } from "@/hooks/useToast";

export default function Verify() {
  const router = useRouter();

  async function identityLogout(formData: FormData) {
    const logout = await identity(formData);
    if (logout?.verificationInitiated) {
      successToast(logout.verificationInitiated);
      router.push("/identity/signin");
    }
    if (logout?.verificationFailed) {
      errorToast(logout.verificationFailed);
      router.refresh();
    }
  }
  return (
    <form action={identityLogout}>
      <input type="text" defaultValue={"LOGOUT"} name="type" hidden />
      <input defaultValue={"VERIFY"} hidden name="logoutType" />
      <SubmitButton text={"Verify again"} />
    </form>
  );
}
