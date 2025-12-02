import { verify } from "crypto";


const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const API_ROUTES = {
    login: `${API_BASE_URL}/auth/login`,
    register: `${API_BASE_URL}/auth/register`,
    verifyToken: `${API_BASE_URL}/auth/verify`,
    userProfile: `${API_BASE_URL}/user`,
    addBusinessProfile: `${API_BASE_URL}/user/business-profile`,
};