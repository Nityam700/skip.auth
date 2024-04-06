'use server'

import { cookies } from 'next/headers'

export async function setSigninBoxCookie() {
    cookies().set({
        name: 'signInBox',
        value: 'close',
        maxAge: 10
    })
    console.log("COOKIE CREATED");
}
