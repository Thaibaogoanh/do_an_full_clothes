export const INIT_TAG_APIPATH = [
  {
    name: 'Create Tag',
    apiPath: '/api/v1/tag',
    method: 'POST',
    module: 'Tag',
  },
  {
    name: 'Get Tags',
    apiPath: '/api/v1/tag',
    method: 'GET',
    module: 'Tag',
  },
  {
    name: 'Get Tag By Id',
    apiPath: '/api/v1/tag/:id',
    method: 'GET',
    module: 'Tag',
  },
  {
    name: 'Update Tag',
    apiPath: '/api/v1/tag/:id',
    method: 'PATCH',
    module: 'Tag',
  },
  {
    name: 'Delete Tag',
    apiPath: '/api/v1/tag/:id',
    method: 'DELETE',
    module: 'Tag',
  },
];
