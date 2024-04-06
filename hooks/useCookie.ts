import { cookies } from "next/headers";

export function useSignInBoxCookie() {
    const cookie = cookies().get("signInBox")
    if (cookie) {
        const cookieValue = cookie.value
        return cookieValue
    } else {
        const cookieValue = 'open'
        return cookieValue
    }
}