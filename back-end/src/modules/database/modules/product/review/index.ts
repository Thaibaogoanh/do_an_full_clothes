export const INIT_REVIEW_APIPATH = [
  {
    name: 'Create Review',
    apiPath: '/api/v1/review',
    method: 'POST',
    module: 'Review',
  },
  {
    name: 'Get Reviews',
    apiPath: '/api/v1/review',
    method: 'GET',
    module: 'Review',
  },
  {
    name: 'Get Review By Id',
    apiPath: '/api/v1/review/:id',
    method: 'GET',
    module: 'Review',
  },
  {
    name: 'Update Review',
    apiPath: '/api/v1/review/:id',
    method: 'PATCH',
    module: 'Review',
  },
  {
    name: 'Delete Review',
    apiPath: '/api/v1/review/:id',
    method: 'DELETE',
    module: 'Review',
  },
];
