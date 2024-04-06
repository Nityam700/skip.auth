"use client";
import { useRouter } from "next/navigation";
import { identity } from "@/server/authentication/identity";
import { SubmitButton } from "@/ui/SubmitButton";
import { errorToast, successToast } from "@/hooks/useToast";

export interface Logout {
  revokingSessionId: any;
  revokingSessionToken: any;
  username: any;
  userId: any;
}

export default function Revoke({
  revokingSessionId,
  revokingSessionToken,
  username,
  userId,
}: Logout) {
  const router = useRouter();

  async function identityLogout(formData: FormData) {
    const logout = await identity(formData);
    if (logout?.revokeSuccess) {
      successToast(logout.revokeSuccess);
      router.refresh();
    }
    if (logout?.RevokeError) {
      errorToast(logout.RevokeError);
    }
    if (logout?.sessionExpired) {
      errorToast(logout.sessionExpired);
      router.refresh();
    }
  }

  return (
    <form action={identityLogout}>
      <input type="text" defaultValue={"LOGOUT"} name="type" hidden />
      <input type="text" defaultValue={"REVOKE"} name="logoutType" hidden />
      <input
        type="text"
        defaultValue={revokingSessionId}
        hidden
        name="revokingSessionId"
      />
      <input
        type="text"
        defaultValue={revokingSessionToken}
        name="revokingSessionToken"
        hidden
      />

      <input type="text" defaultValue={username} hidden name="username" />
      <input type="text" defaultValue={userId} hidden name="userId" />
      <SubmitButton text={"Revoke"} />
    </form>
  );
}
