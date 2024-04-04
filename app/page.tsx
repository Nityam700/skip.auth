import { getSession, ip } from "@/server/authentication/session";
import Logout from "@/server/authentication/ui/Logout";
import { Button } from "@/ui/Button";
import { Header } from "@/ui/Header";
import Themebtn from "@/ui/theme-btn";
import Link from "next/link";

export default async function Home() {
  const user = getSession();
  const session = user.sessionExists;

  await ip();
  return (
    <main>
      <Header />
      <div className="md:transform md:absolute md:left-1/2 md:top-1/2 md:translate-x-[-50%] ml-2 mr-2 md:ml-0 md:mr-0 md:translate-y-[-50%]">
        <h1 className="text-[50px] md:text-[80px] text-center mb-5">
          Auth folder prepared for you.
        </h1>
        <p className="md:text-[24px] text-xl text-center mb-5">
          Complete package with a dashboard section to manage your users and
          other Authentication related things
        </p>
        <div className="flex flex-wrap justify-center gap-5">
          {!session && (
            <Link href={"/identity/create"}>
              <Button text={"Get Started"}></Button>
            </Link>
          )}
          {session && (
            <Link href={"/app"}>
              <Button text={"App"}></Button>
            </Link>
          )}
          {!session && (
            <Link href={"/identity/signin"}>
              <Button text={"Sign In"}></Button>
            </Link>
          )}
          <Themebtn />
          {session && <Logout />}
        </div>
      </div>
    </main>
  );
}
