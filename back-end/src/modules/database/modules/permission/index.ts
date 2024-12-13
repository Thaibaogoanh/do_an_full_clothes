export const INIT_PERMISSION_APIPATH = [
  {
    name: 'Create Permission',
    apiPath: '/api/v1/permission',
    method: 'POST',
    module: 'Permission',
  },
  {
    name: 'Get Permissions',
    apiPath: '/api/v1/permission',
    method: 'GET',
    module: 'Permission',
  },
  {
    name: 'Get Permission By Id',
    apiPath: '/api/v1/permission/:id',
    method: 'GET',
    module: 'Permission',
  },
  {
    name: 'Update Permission',
    apiPath: '/api/v1/permission/:id',
    method: 'PATCH',
    module: 'Permission',
  },
  {
    name: 'Delete Permission',
    apiPath: '/api/v1/permission/:id',
    method: 'DELETE',
    module: 'Permission',
  },
];
