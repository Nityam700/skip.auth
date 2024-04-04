import { connectDatabase } from "@/server/database/connect";
import {
  getProfile,
  isUserExists,
  sessionCount,
} from "@/server/database/data/userDetails";

interface Params {
  profile: string;
}

export default async function Profile({ params }: { params: Params }) {
  const username = params.profile;
  await connectDatabase();
  const userExists = await isUserExists(username);
  const totalSession = await sessionCount();

  if (userExists) {
    const user = await getProfile(username);
    const role = user.role === "USER";

    return (
      <div>
        <p>{user.username}</p>
        <p>{user.role}</p>
        <p>{user._id}</p>
        {role && <div>Hello User</div>}
        <p>{totalSession}</p>
      </div>
    );
  } else {
    return <div>No user exists</div>;
  }
}
