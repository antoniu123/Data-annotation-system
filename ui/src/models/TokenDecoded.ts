import { Roles } from "./Roles";

export interface TokenDecoded {
    jti: number
    iss: string
    iat: number
    exp: number
    roles: Roles[]
    sub: string
    email: string
}