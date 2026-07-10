const BASE_AUTH = "/api/auth";
const BASE_USERS = "/api/users";
const BASE_ORGS = "/api/orgs";
const BASE_PROJECTS = "/api/projects";
const BASE_INVITATIONS = "/api/invitations";
const BASE_API_KEYS = "/api/api-keys";
const BASE_ENVIRONMENTS = "/api/environments";

export const API_ENDPOINTS = {

    AUTH: {
        LOGIN: `${BASE_AUTH}/login`,
        LOGOUT: `${BASE_AUTH}/logout`,
        SET_PASSWORD: `${BASE_AUTH}/set-password`,
        REFRESH_ACCESS_TOKEN: `${BASE_AUTH}/refresh-token`,
    },

    USERS: {
        BASE: BASE_USERS,
        BY_ID: (id: string) => `${BASE_USERS}/${id}`,
    },

    ORGS: {
        BASE: BASE_ORGS,
        BY_ID: (id: string) => `${BASE_ORGS}/${id}`,
    },

    PROJECTS: {
        BASE: BASE_PROJECTS,
        BY_ID: (id: string) => `${BASE_PROJECTS}/${id}`,
    },

    ENVIRONMENTS: {
        BASE: BASE_ENVIRONMENTS,
        BY_ID: (id: string) => `${BASE_ENVIRONMENTS}/${id}`,
    },

    API_KEYS: {
        BASE: BASE_API_KEYS,
        BY_ID: (id: string) => `${BASE_API_KEYS}/${id}`,
    },

    INVITATIONS: {
        BASE: BASE_INVITATIONS,
        BY_ID: (id: string) => `${BASE_INVITATIONS}/${id}`,
    },

} as const;