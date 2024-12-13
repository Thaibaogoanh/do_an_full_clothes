export const INIT_ROLE_APIPATH = [
  {
    name: 'Create Role',
    apiPath: '/api/v1/role',
    method: 'POST',
    module: 'Role',
  },
  {
    name: 'Get Roles',
    apiPath: '/api/v1/role',
    method: 'GET',
    module: 'Role',
  },
  {
    name: 'Get Role By Id',
    apiPath: '/api/v1/role/:id',
    method: 'GET',
    module: 'Role',
  },
  {
    name: 'Update Role',
    apiPath: '/api/v1/role/:id',
    method: 'PATCH',
    module: 'Role',
  },
  {
    name: 'Delete Role',
    apiPath: '/api/v1/role/:id',
    method: 'DELETE',
    module: 'Role',
  },
];
