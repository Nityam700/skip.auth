import { getSession } from "@/server/authentication/session";
import { getProfile } from "@/server/database/data/userDetails";

export default async function Identity() {
  const user = getSession();
  const profile = await getProfile(user?.username!);
  return <div>{profile.username}</div>;
}
