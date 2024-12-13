export const INIT_ORDER_ITEM_APIPATH = [
  {
    name: 'Create Order Item',
    apiPath: '/api/v1/order-item',
    method: 'POST',
    module: 'OrderItem',
  },
  {
    name: 'Get Order Items',
    apiPath: '/api/v1/order-item',
    method: 'GET',
    module: 'OrderItem',
  },
  {
    name: 'Get Order Item By Id',
    apiPath: '/api/v1/order-item/:id',
    method: 'GET',
    module: 'OrderItem',
  },
  {
    name: 'Update Order Item',
    apiPath: '/api/v1/order-item/:id',
    method: 'PATCH',
    module: 'OrderItem',
  },
  {
    name: 'Delete Order Item',
    apiPath: '/api/v1/order-item/:id',
    method: 'DELETE',
    module: 'OrderItem',
  },
];
