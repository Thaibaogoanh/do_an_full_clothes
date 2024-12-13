export const INIT_PRICE_APIPATH = [
  {
    name: 'Create Price',
    apiPath: '/api/v1/price',
    method: 'POST',
    module: 'Price',
  },
  {
    name: 'Get Prices',
    apiPath: '/api/v1/price',
    method: 'GET',
    module: 'Price',
  },
  {
    name: 'Get Price By Id',
    apiPath: '/api/v1/price/:id',
    method: 'GET',
    module: 'Price',
  },
  {
    name: 'Update Price',
    apiPath: '/api/v1/price/:id',
    method: 'PATCH',
    module: 'Price',
  },
  {
    name: 'Delete Price',
    apiPath: '/api/v1/price/:id',
    method: 'DELETE',
    module: 'Price',
  },
];
