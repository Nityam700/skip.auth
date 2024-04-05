import { getBrowserCookie } from "@/server/cookie/session";
import Image from "next/image";
import Link from "next/link";

export function Header() {
  const session = getBrowserCookie();
  const userurl = session?.username || "/";
  return (
    <header className="flex justify-between m-8 items-center">
      <div className="">
        <h1 className="text-3xl">skip auth</h1>
      </div>
      <div>
        <Link href={userurl}>
          <Image
            className="rounded-full"
            src={"/images/pp.png"}
            alt="PP"
            width={40}
            height={40}
          />
        </Link>
      </div>
    </header>
  );
}
