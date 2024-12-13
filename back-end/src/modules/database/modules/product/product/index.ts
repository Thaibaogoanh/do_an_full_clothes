export const INIT_PRODUCT_APIPATH = [
  {
    name: 'Create Product',
    apiPath: '/api/v1/product',
    method: 'POST',
    module: 'Product',
  },
  {
    name: 'Get Products',
    apiPath: '/api/v1/product',
    method: 'GET',
    module: 'Product',
  },
  {
    name: 'Get Product By Id',
    apiPath: '/api/v1/product/:id',
    method: 'GET',
    module: 'Product',
  },
  {
    name: 'Update Product',
    apiPath: '/api/v1/product/:id',
    method: 'PATCH',
    module: 'Product',
  },
  {
    name: 'Delete Product',
    apiPath: '/api/v1/product/:id',
    method: 'DELETE',
    module: 'Product',
  },
];
