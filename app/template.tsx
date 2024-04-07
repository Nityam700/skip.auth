import { useSignInBoxCookie } from "@/hooks/useCookie";
import { useSession } from "@/hooks/useSession";
import { useSessionInDb } from "@/hooks/useSessionIdDb";
import Logout from "@/server/authentication/ui/Logout";
import SigninForm from "@/server/authentication/ui/SigninForm";
import { setSigninBoxCookie } from "@/server/cookie/setCookie";
export default async function Template({
  children,
}: {
  children: React.ReactNode;
}) {
  const user = useSession();
  if (user) {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const sessionInDb = await useSessionInDb();
    if (sessionInDb) {
      // const isRevoked = sessionInDb.isRevoked;
      return <div className="fadeIn">{children}</div>;
    } else {
      return (
        <div className="fadeIn">
          <div className="p-4 flex flex-col gap-3 h-dvh justify-center items-center">
            <p className="text-4xl font-semibold">Invalid session!</p>
            <p>
              hi {user.username}!<br /> You current session has been revoked. To
              verify you identity sign In again.
            </p>
            <Logout />
          </div>
          {/* {children} */}
        </div>
      );
    }
  } else {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    const cookie = useSignInBoxCookie();
    console.log(cookie);

    const open = cookie === "open";
    return (
      <div className="fadeIn">
        {/* {open && (
          <div className="surface z-50 w-[390] h-auto p-4 rounded-2xl fixed top-3 right-3">
            <div className="mt-8">
              <SigninForm />
            </div>
            <form
              className="absolute right-5 top-5"
              action={setSigninBoxCookie}
            >
              <button type="submit">✕</button>
            </form>
          </div>
        )} */}
        {children}
      </div>
    );
  }
}
