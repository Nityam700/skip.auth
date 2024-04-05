import {
  getSessions,
  getUserAllBlackListedToken,
} from "@/server/authentication/identity";
import DeleteRevokedSession from "@/server/authentication/ui/deleteRevokedSession";
import Revoke from "@/server/authentication/ui/revokeSessionForm";
import { getProfile } from "@/server/database/data/userDetails";

export default async function Identity() {
  const profile = await getProfile();
  const userDbSessions = await getSessions();
  const userBlacklistedToken = await getUserAllBlackListedToken();
  // console.log(sessions);
  const isTokenExists = userBlacklistedToken === null;
  // console.log("TOKEN EXISTS OR NOT ? = " + isTokenExists);

  return (
    <div className="lg:ml-24 lg:mr-24 mt-5 md:ml-12 md:mr-12 m-1">
      <div className="flex justify-center items-center text-3xl">
        Hi {profile?.username}
      </div>
      <div>
        <div className="pl-1 mb-2">
          <p className="text-xl">Your sessions:</p>
        </div>
        <div className="flex flex-col gap-3">
          <div className="grid gap-3 2xl:grid-cols-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {userDbSessions?.map((session) => (
              <div
                key={session._id}
                className="surface rounded-2xl flex flex-col gap-2 p-4"
              >
                <div>
                  <h2>{session?.username}</h2>
                </div>
                <div className="flex gap-2 items-center">
                  <h2>Approx ip:</h2>
                  <p>{session?.ipAddress}</p>
                </div>
                <div className="flex gap-2 ">
                  <h2>Signed in on:</h2>
                  <p>{session?.date.toString()}</p>
                </div>
                <Revoke
                  revokingSessionId={session?._id}
                  revokingSessionToken={session?.token}
                  username={session.username}
                  userId={session.userId}
                />
              </div>
            ))}
          </div>
          <div>
            <div className="grid gap-3 2xl:grid-cols-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
              {userBlacklistedToken?.map((token) => (
                <div
                  key={token._id}
                  className="surface rounded-2xl flex flex-col gap-2 p-4"
                >
                  <div className="flex bg-emerald-50 p-1 text-black rounded-xl gap-2 ">
                    <h2>Session is revoked. You can safely delete this.</h2>
                  </div>
                  <div className="flex gap-2 ">
                    <h2>Session Id:</h2>
                    <p>{token?._id}</p>
                  </div>
                  <div className="flex gap-2 ">
                    <h2>Revoked on:</h2>
                    <p>{token?.blcklistedOn.toString()}</p>
                  </div>
                  <DeleteRevokedSession revokedSessionId={token._id} />
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
