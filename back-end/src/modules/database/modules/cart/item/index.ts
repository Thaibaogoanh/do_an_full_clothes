export const INIT_CART_ITEM_APIPATH = [
  {
    name: 'Create Cart Item',
    apiPath: '/api/v1/cart-item',
    method: 'POST',
    module: 'CartItem',
  },
  {
    name: 'Get Cart Items',
    apiPath: '/api/v1/cart-item',
    method: 'GET',
    module: 'CartItem',
  },
  {
    name: 'Get Cart Item By Id',
    apiPath: '/api/v1/cart-item/:id',
    method: 'GET',
    module: 'CartItem',
  },
  {
    name: 'Update Cart Item',
    apiPath: '/api/v1/cart-item/:id',
    method: 'PATCH',
    module: 'CartItem',
  },
  {
    name: 'Delete Cart Item',
    apiPath: '/api/v1/cart-item/:id',
    method: 'DELETE',
    module: 'CartItem',
  },
];
