import { cookies } from "next/headers";

export function useTheme() {
    const theme = cookies().get("theme")
    if (theme) {
        const themeValue = theme.value
        return themeValue
    } else {
        const themeValue = 'dark'
        return themeValue
    }
}