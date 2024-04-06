import { cookies } from "next/headers";
import jwt, { JwtPayload } from "jsonwebtoken";
import axios from "axios";

interface DecodedToken extends JwtPayload {
  _id: string;
  username: string;
  role: string;
  date: string;
  sessionId: string;
  ip: string;
  sessionExists: boolean;
}
export function useSession() {
  const token = cookies().get("User");
  const tokenValue = token?.value
  if (token) {
    const user = jwt.decode(token.value) as DecodedToken;
    if (user) {
      const userId = user._id;
      const username = user.username;
      const role = user.role;
      const ipAddress = user.ip;
      const sessionId = user.sessionId;

      return {
        userId,
        username,
        role,
        ipAddress,
        sessionId,
        tokenValue,
      };
    }
  }
}

export async function ip() {
  try {
    const ip = await axios.get("https://api.ipify.org/?format=json");
    const userIp = ip?.data.ip;
    return userIp
  } catch (error) {
    console.log(error);
  }
}