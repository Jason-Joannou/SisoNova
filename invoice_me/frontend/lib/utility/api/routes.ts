import { verify } from "crypto";

export const API_ROUTES = {
    user: (userId: string) => `/users/${userId}`,
    businessProfiles: (userId: string) => `/users/${userId}/business-profiles`,
    addBusinessProfile: (userId: string) => `/users/${userId}/business-profiles`,
    specificBusinessProfile: (userId: string, companyName: string) => `/users/${userId}/business-profiles/${companyName}`,
    serviceOverviewSummary: (userId: string, companyName: string, service: string) => `/${service}/${userId}/${companyName}/invoice-overview`,
};