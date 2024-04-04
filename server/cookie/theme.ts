"use server"
import { cookies } from "next/headers";

export async function themeOptions(formData: FormData) {
    const type = formData.get('type')
    const cookie = cookies()
    if (type === "DARK") {
        try {
            cookie.delete('theme')
            cookie.set('theme', 'dark')
            return {
                dark: "Dark theme enabled"
            }
        } catch (error) {
            return {
                themeErrordark: "Failed to enale dark theme"
            }
        }
    }
    if (type === "LIGHT") {
        try {
            cookies().delete('theme')
            cookies().set('theme', 'light')
            return {
                light: "light theme enabled"
            }
        } catch (error) {
            return {
                themeErrorlight: "Failed to enale light theme"
            }
        }
    }
}

