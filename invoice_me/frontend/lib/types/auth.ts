import { UserAuthentication, UserProfile } from "./user-information";

export interface AuthContextProps {
    user: UserProfile | null;
    login: (credentials: UserAuthentication) => Promise<void>;
    register: (details: UserAuthentication) => Promise<void>;
    logout: () => void;
    isAuthenticated: boolean;
    loading: boolean;
}