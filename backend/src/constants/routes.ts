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
 
} as const;

// Base paths
export const BASE_PATHS = {
  AUTH: '/api',
  URL: '/url',
  IMAGE: '/api/images'
} as const;
2