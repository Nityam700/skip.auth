"use server"
import { cookies } from "next/headers";



export async function closeBox() {
    cookies().delete('SignInBox')
}