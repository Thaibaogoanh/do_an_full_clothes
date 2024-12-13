export const INIT_USER_APIPATH = [
  {
    name: 'Create User',
    apiPath: '/api/v1/user',
    method: 'POST',
    module: 'User',
  },
  {
    name: 'Get Users',
    apiPath: '/api/v1/user',
    method: 'GET',
    module: 'User',
  },
  {
    name: 'Get User By Id',
    apiPath: '/api/v1/user/:id',
    method: 'GET',
    module: 'User',
  },
  {
    name: 'Update User',
    apiPath: '/api/v1/user/:id',
    method: 'PATCH',
    module: 'User',
  },
  {
    name: 'Delete User',
    apiPath: '/api/v1/user/:id',
    method: 'DELETE',
    module: 'User',
  },
];
