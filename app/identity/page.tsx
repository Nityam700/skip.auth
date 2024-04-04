import { getBrowserCookie } from "@/server/authentication/session";
import { getProfile } from "@/server/database/data/userDetails";

export default async function Identity() {
  const user = getBrowserCookie();
  const profile = await getProfile(user?.username!);
  return <div>{profile.username}</div>;
}
