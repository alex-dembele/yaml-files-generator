import { jwtDecode } from "jwt-decode";

export const decodeJwtToken = (token: string) => {

    return jwtDecode(token);
}