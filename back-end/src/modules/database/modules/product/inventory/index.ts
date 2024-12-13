export const INIT_INVENTORY_APIPATH = [
  {
    name: 'Create Inventory',
    apiPath: '/api/v1/inventory',
    method: 'POST',
    module: 'Inventory',
  },
  {
    name: 'Get Inventorys',
    apiPath: '/api/v1/inventory',
    method: 'GET',
    module: 'Inventory',
  },
  {
    name: 'Get Inventory By Id',
    apiPath: '/api/v1/inventory/:id',
    method: 'GET',
    module: 'Inventory',
  },
  {
    name: 'Update Inventory',
    apiPath: '/api/v1/inventory/:id',
    method: 'PATCH',
    module: 'Inventory',
  },
  {
    name: 'Delete Inventory',
    apiPath: '/api/v1/inventory/:id',
    method: 'DELETE',
    module: 'Inventory',
  },
];
