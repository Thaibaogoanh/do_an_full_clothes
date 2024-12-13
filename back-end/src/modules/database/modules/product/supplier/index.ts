export const INIT_SUPPLIER_APIPATH = [
  {
    name: 'Create Supplier',
    apiPath: '/api/v1/supplier',
    method: 'POST',
    module: 'Supplier',
  },
  {
    name: 'Get Suppliers',
    apiPath: '/api/v1/supplier',
    method: 'GET',
    module: 'Supplier',
  },
  {
    name: 'Get Supplier By Id',
    apiPath: '/api/v1/supplier/:id',
    method: 'GET',
    module: 'Supplier',
  },
  {
    name: 'Update Supplier',
    apiPath: '/api/v1/supplier/:id',
    method: 'PATCH',
    module: 'Supplier',
  },
  {
    name: 'Delete Supplier',
    apiPath: '/api/v1/supplier/:id',
    method: 'DELETE',
    module: 'Supplier',
  },
];
