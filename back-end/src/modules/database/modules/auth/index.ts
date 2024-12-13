export const INIT_AUTH_APIPATH = [
  {
    name: 'Sign out',
    apiPath: '/api/v1/auth/signout',
    method: 'POST',
    module: 'Auth',
  },
  {
    name: 'Sign in',
    apiPath: '/api/v1/auth/signin',
    method: 'POST',
    module: 'Auth',
  },
  {
    name: 'Sign up',
    apiPath: '/api/v1/auth/signup',
    method: 'POST',
    module: 'Auth',
  },
  {
    name: 'Refresh token',
    apiPath: '/api/v1/auth/refresh',
    method: 'GET',
    module: 'Auth',
  },
  {
    name: 'Get Profile',
    apiPath: '/api/v1/auth/account',
    method: 'GET',
    module: 'Auth',
  },
  {
    name: 'Get Profile',
    apiPath: '/api/v1/auth/profile',
    method: 'GET',
    module: 'Auth',
  },
];
