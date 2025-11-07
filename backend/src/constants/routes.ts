// API Route Constants
export const API_ROUTES = {
  // Auth routes
  AUTH: {
    LOGIN: '/login',
    REGISTER: '/register',
    REFRESH_TOKEN: '/refresh-token',
    LOGOUT: '/logout'
  },
  
  // URL routes
  URL: {
    CREATE_SHORT_URL: '/create-shorturl',
    USER_HISTORY: '/user-history',
    REDIRECT: '/:shortId'
  }
} as const;

// Base paths
export const BASE_PATHS = {
  AUTH: '/',
  URL: '/url'
} as const;
2