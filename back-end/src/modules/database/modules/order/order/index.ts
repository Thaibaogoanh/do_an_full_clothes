export const INIT_ORDER_APIPATH = [
  {
    name: 'Create Order',
    apiPath: '/api/v1/order',
    method: 'POST',
    module: 'Order',
  },
  {
    name: 'Get Orders',
    apiPath: '/api/v1/order',
    method: 'GET',
    module: 'Order',
  },
  {
    name: 'Get Order By Id',
    apiPath: '/api/v1/order/:id',
    method: 'GET',
    module: 'Order',
  },
  {
    name: 'Update Order',
    apiPath: '/api/v1/order/:id',
    method: 'PATCH',
    module: 'Order',
  },
  {
    name: 'Delete Order',
    apiPath: '/api/v1/order/:id',
    method: 'DELETE',
    module: 'Order',
  },
];
