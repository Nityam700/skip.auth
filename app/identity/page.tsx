import { getSessions } from "@/server/authentication/identity";
import Revoke from "@/server/authentication/ui/revokeSessionForm";
import { getProfile } from "@/server/database/data/userDetails";

export default async function Identity() {
  const profile = await getProfile();
  const sessions = await getSessions();
  console.log(sessions);

  return (
    <div>
      {profile.username}
      <div className="bg-emerald-50">
        {sessions?.map((session) => (
          <div key={session._id}>
            <p>{session.username}</p>
            <p>{session.ipAddress}</p>
            <p>{session.token}</p>
            <p>{session.date.toString()}</p>
            <Revoke
              revokingSessionId={session._id}
              revokingSessionToken={session.token}
            />
          </div>
        ))}
      </div>
    </div>
  );
}
