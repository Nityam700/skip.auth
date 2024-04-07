import { useSession } from "@/hooks/useSession";
import {} from "@/server/authentication/identity";
import Revoke from "@/server/authentication/ui/revokeSessionForm";
import { getUserSessionsList } from "@/server/database/data/authentication/getUserSessionsList";

export default async function Identity() {
  const userDbSessions = await getUserSessionsList();
  const user = useSession();
  return (
    <div className="lg:ml-24 lg:mr-24 mt-5 md:ml-12 md:mr-12 m-1">
      <div className="flex justify-center items-center text-3xl">
        Hi {user?.username}
      </div>
      <div>
        <div className="pl-1 mb-2">
          <p className="text-xl">Your sessions:</p>
        </div>
        <div className="grid gap-3 2xl:grid-cols-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
          {userDbSessions?.map((session) => (
            <div
              key={session._id}
              className="surface rounded-2xl flex flex-col gap-2 p-4"
            >
              {session.isRevoked && <div>Session Revoked</div>}
              <div>
                <h2>{session?.username}</h2>
              </div>
              <div className="flex gap-2 items-center">
                <h2>Session id:</h2>
                <p>{session?._id}</p>
              </div>
              <div className="flex gap-2 items-center">
                <h2>Approx ip:</h2>
                <p>{session?.ipAddress}</p>
              </div>
              <div className="flex gap-2 ">
                <h2>Signed in on:</h2>
                <p>
                  {new Intl.DateTimeFormat("en-US", {
                    weekday: "long",
                    year: "numeric",
                    month: "long",
                    day: "numeric",
                    hour: "numeric",
                    minute: "numeric",
                    second: "numeric",
                    hour12: false,
                    localeMatcher: "best fit",
                    // timeZoneName: "short",
                  }).format(session?.date)}
                </p>
              </div>
              <div className="flex gap-2 items-center">
                <h2>is revoked:</h2>
                <p>{session?.isRevoked.toString()}</p>
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
      </div>
    </div>
  );
}
