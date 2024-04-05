"use client";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import { identity } from "@/server/authentication/identity";
import { SubmitButton } from "@/ui/SubmitButton";

export interface Logout {
  revokedSessionId: any;
}

export default function DeleteRevokedSession({ revokedSessionId }: Logout) {
  const router = useRouter();

  async function identityLogout(formData: FormData) {
    const logout = await identity(formData);
    if (logout?.deleteSuccess) {
      toast.success(logout.deleteSuccess, {
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
      router.refresh();
    }
    if (logout?.deleteError) {
      toast.error(logout.deleteError, {
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
    if (logout?.tokenBlackListed) {
      toast.error(logout.tokenBlackListed, {
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
      router.refresh();
    }
  }

  return (
    <form action={identityLogout}>
      <input type="text" defaultValue={"LOGOUT"} name="type" hidden />
      <input type="text" defaultValue={"DELETE"} name="logoutType" hidden />
      <input
        type="text"
        defaultValue={revokedSessionId}
        hidden
        name="revokedSessionId"
      />
      <SubmitButton text={"Delete"} />
    </form>
  );
}
