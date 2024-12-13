export const INIT_BRAND_APIPATH = [
  {
    name: 'Create Brand',
    apiPath: '/api/v1/brand',
    method: 'POST',
    module: 'Brand',
  },
  {
    name: 'Get Brands',
    apiPath: '/api/v1/brand',
    method: 'GET',
    module: 'Brand',
  },
  {
    name: 'Get Brand By Id',
    apiPath: '/api/v1/brand/:id',
    method: 'GET',
    module: 'Brand',
  },
  {
    name: 'Update Brand',
    apiPath: '/api/v1/brand/:id',
    method: 'PATCH',
    module: 'Brand',
  },
  {
    name: 'Delete Brand',
    apiPath: '/api/v1/brand/:id',
    method: 'DELETE',
    module: 'Brand',
  },
];
