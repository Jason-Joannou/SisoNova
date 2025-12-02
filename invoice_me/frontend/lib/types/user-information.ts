import { BusinessInformation } from "./business-information"
export interface UserProfile {
    email: string
    business_profile: BusinessInformation[]
}

export interface UserAuthentication {
    email: string
    password: string
}

export interface AuthenticatedUser {
    access_token: string
    refresh_token: string
    token_type: string
    user: UserProfile
}
