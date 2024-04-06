import { useSession } from "@/hooks/useSession";
import { useSessionInDb } from "@/hooks/useSessionIdDb";
import Verify from "@/server/authentication/ui/Verify";
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
            <Verify />
          </div>
          {/* {children} */}
        </div>
      );
    }
  } else {
    return (
      <div className="fadeIn">
        <div className="w-full p-3 bg-emerald-200 text-zinc-900 fixed top-0 text-center">
          SIGN IN TO CONTINUE
        </div>
        {children}
      </div>
    );
  }
}
