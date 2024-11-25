import { deleteCookie } from "cookies-next"


export const logout = () => {
    deleteCookie("access")
    deleteCookie("account")
}