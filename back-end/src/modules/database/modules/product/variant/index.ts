export const INIT_VARIANT_APIPATH = [
  {
    name: 'Create Variant',
    apiPath: '/api/v1/variant',
    method: 'POST',
    module: 'Variant',
  },
  {
    name: 'Get Variants',
    apiPath: '/api/v1/variant',
    method: 'GET',
    module: 'Variant',
  },
  {
    name: 'Get Variant By Id',
    apiPath: '/api/v1/variant/:id',
    method: 'GET',
    module: 'Variant',
  },
  {
    name: 'Update Variant',
    apiPath: '/api/v1/variant/:id',
    method: 'PATCH',
    module: 'Variant',
  },
  {
    name: 'Delete Variant',
    apiPath: '/api/v1/variant/:id',
    method: 'DELETE',
    module: 'Variant',
  },
];
