import { verify } from "crypto";


const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8000";

export const API_ROUTES = {
    me: `${API_BASE_URL}/user`,
    addBusinessProfile: `${API_BASE_URL}/user/business-profile`,
};