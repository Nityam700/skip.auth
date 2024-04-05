import { closeBox } from "@/server/cookie/signInBox";
import { cookies } from "next/headers";

export function SignInBox() {
  const cookie = cookies().get("SignInBox");
  const value = cookie?.value;
  return (
    <div>
      {value && (
        <div className="bg-[#171717] p-4 rounded-2xl fixed top-2 right-2 w-96 h-96">
          <form action={closeBox}>
            <button type="submit">close</button>
          </form>
          <div className="mt-9">1</div>
        </div>
      )}
    </div>
  );
}
