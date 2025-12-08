import { BusinessProfile } from "./business-information"
export interface UserProfile {
    email: string
    preferred_business_profile: string
    business_profile: BusinessProfile
}

export interface UserAuthentication {
    email: string
    password: string
}

export interface AuthenticatedUser {
    access_token: string
    token_type: string
    user: UserProfile
}
