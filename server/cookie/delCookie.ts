"use server"

import { cookies } from "next/headers"

export async function delCookie() {
    try {
        cookies().set('signInBox', 'close', { maxAge: 3600 });
        return {
            successMessage: "Hidden for 1 hour"
        }
    } catch (error) {
        return {
            errorMessage: "Failed to close"
        }
    }
}