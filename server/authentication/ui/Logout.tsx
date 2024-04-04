"use client";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { identity } from "@/server/authentication/identity";
import { SubmitButton } from "@/ui/SubmitButton";

export default function Logout() {
  const router = useRouter();

  async function identityLogout(formData: FormData) {
    const logout = await identity(formData);
    if (logout?.logoutSuccess) {
      toast.success(logout.logoutSuccess, {
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
      router.push("/");
    }
    if (logout?.logoutError) {
      toast.error(logout.logoutError, {
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
    <form action={identityLogout}>
      <input type="text" defaultValue={"LOGOUT"} name="type" hidden />
      <input defaultValue={"CURRENT_SESSION"} hidden name="logoutType" />
      <SubmitButton text={"Logout"} />
    </form>
  );
}
