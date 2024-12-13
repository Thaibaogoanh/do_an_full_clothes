export const INIT_CONTACT_APIPATH = [
  {
    name: 'Create Contact',
    apiPath: '/api/v1/contact',
    method: 'POST',
    module: 'Contact',
  },
  {
    name: 'Get Contacts',
    apiPath: '/api/v1/contact',
    method: 'GET',
    module: 'Contact',
  },
  {
    name: 'Get Contact By Id',
    apiPath: '/api/v1/contact/:id',
    method: 'GET',
    module: 'Contact',
  },
  {
    name: 'Update Contact',
    apiPath: '/api/v1/contact/:id',
    method: 'PATCH',
    module: 'Contact',
  },
  {
    name: 'Delete Contact',
    apiPath: '/api/v1/contact/:id',
    method: 'DELETE',
    module: 'Contact',
  },
];
