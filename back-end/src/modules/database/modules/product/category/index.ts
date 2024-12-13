export const INIT_CATEGORY_APIPATH = [
  {
    name: 'Create Category',
    apiPath: '/api/v1/category',
    method: 'POST',
    module: 'Category',
  },
  {
    name: 'Get Categorys',
    apiPath: '/api/v1/category',
    method: 'GET',
    module: 'Category',
  },
  {
    name: 'Get Category By Id',
    apiPath: '/api/v1/category/:id',
    method: 'GET',
    module: 'Category',
  },
  {
    name: 'Update Category',
    apiPath: '/api/v1/category/:id',
    method: 'PATCH',
    module: 'Category',
  },
  {
    name: 'Delete Category',
    apiPath: '/api/v1/category/:id',
    method: 'DELETE',
    module: 'Category',
  },
];

export const INIT_CATEGORY_LEVEL_1 = [
  {
    name: 'Áo',
    description: 'Áo thời trang',
    isActivated: true,
  },
  {
    name: 'Quần',
    description: 'Quần thời trang',
    isActivated: true,
  },
  {
    name: 'Giày',
    description: 'Giày thời trang',
    isActivated: true,
  },
];

export const INIT_CATEGORY_LEVEL_2 = [
  {
    name: 'Áo sơ mi',
    description: 'Áo sơ mi thời trang',
    isActivated: true,
  },
  {
    name: 'Áo thun',
    description: 'Áo thun thời trang',
    isActivated: true,
  },
  {
    name: 'Áo khoác',
    description: 'Áo khoác thời trang',
    isActivated: true,
  },
  {
    name: 'Quần jean',
    description: 'Quần jean thời trang',
    isActivated: true,
  },
  {
    name: 'Quần kaki',
    description: 'Quần kaki thời trang',
    isActivated: true,
  },
  {
    name: 'Giày thể thao',
    description: 'Giày thể thao thời trang',
    isActivated: true,
  },
  {
    name: 'Giày lười',
    description: 'Giày lười thời trang',
    isActivated: true,
  },
];
