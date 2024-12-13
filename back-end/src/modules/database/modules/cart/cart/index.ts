export const INIT_CART_APIPATH = [
  {
    name: 'Create Cart',
    apiPath: '/api/v1/cart',
    method: 'POST',
    module: 'Cart',
  },
  {
    name: 'Get Carts',
    apiPath: '/api/v1/cart',
    method: 'GET',
    module: 'Cart',
  },
  {
    name: 'Get Cart By Id',
    apiPath: '/api/v1/cart/:id',
    method: 'GET',
    module: 'Cart',
  },
  {
    name: 'Update Cart',
    apiPath: '/api/v1/cart/:id',
    method: 'PATCH',
    module: 'Cart',
  },
  {
    name: 'Delete Cart',
    apiPath: '/api/v1/cart/:id',
    method: 'DELETE',
    module: 'Cart',
  },
];
