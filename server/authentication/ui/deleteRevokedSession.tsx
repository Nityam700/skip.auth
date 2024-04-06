// "use client";
// import { useRouter } from "next/navigation";
// import { identity } from "@/server/authentication/identity";
// import { SubmitButton } from "@/ui/SubmitButton";
// import { errorToast, successToast } from "@/hooks/useToast";

// export interface Logout {
//   revokedSessionId: any;
// }

// export default function DeleteRevokedSession({ revokedSessionId }: Logout) {
//   const router = useRouter();

//   async function identityLogout(formData: FormData) {
//     const logout = await identity(formData);
//     if (logout?.deleteSuccess) {
//       successToast(logout.deleteSuccess);
//       router.refresh();
//     }
//     if (logout?.deleteError) {
//       errorToast(logout.deleteError);
//     }
//   }

//   return (
//     <form action={identityLogout}>
//       <input type="text" defaultValue={"LOGOUT"} name="type" hidden />
//       <input type="text" defaultValue={"DELETE"} name="logoutType" hidden />
//       <input
//         type="text"
//         defaultValue={revokedSessionId}
//         hidden
//         name="revokedSessionId"
//       />
//       <SubmitButton text={"Delete"} />
//     </form>
//   );
// }
