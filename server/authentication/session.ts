import { cookies } from "next/headers";
import jwt, { JwtPayload } from "jsonwebtoken";
import axios from "axios";

interface DecodedToken extends JwtPayload {
    _id: string,
    username: string;
    role: string,
    date: string,
    sessionId: string,
    ip: string,
    sessionExists: boolean,

}

export function getSession() {
    const cookie = cookies();
    const token = cookie.get("User");
    const session = jwt.decode(token?.value!) as DecodedToken;
    const username = session?.username
    const id = session?._id
    const role = session?.role
    const ip = session?.ip
    const sessionId = session?.sessionId
    const sessionExists = session !== null

    return {
        session,
        sessionExists,
        ip,
        sessionId,
        username,
        id,
        role
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