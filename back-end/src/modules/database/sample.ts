import { INIT_AUTH_APIPATH } from '@/modules/database/modules/auth';
import { INIT_CONTACT_APIPATH } from '@/modules/database/modules/contact';
import { INIT_PERMISSION_APIPATH } from '@/modules/database/modules/permission';
import { INIT_ROLE_APIPATH } from '@/modules/database/modules/role';
import { INIT_USER_APIPATH } from '@/modules/database/modules/user';
import {
  INIT_BRAND_APIPATH,
  INIT_CATEGORY_APIPATH,
  INIT_INVENTORY_APIPATH,
  INIT_PRICE_APIPATH,
  INIT_PRODUCT_APIPATH,
  INIT_REVIEW_APIPATH,
  INIT_SUPPLIER_APIPATH,
  INIT_TAG_APIPATH,
  INIT_VARIANT_APIPATH,
} from '@/modules/database/modules/product';
import { INIT_CART_APIPATH, INIT_CART_ITEM_APIPATH } from '@/modules/database/modules/cart';
import { INIT_ORDER_APIPATH, INIT_ORDER_ITEM_APIPATH } from '@/modules/database/modules/order';

const USER_ROLE = 'USER';
const ADMIN_ROLE = 'ADMIN';

const INIT_PERMISSIONS = [
  ...INIT_AUTH_APIPATH,
  ...INIT_CONTACT_APIPATH,
  ...INIT_PERMISSION_APIPATH,
  ...INIT_ROLE_APIPATH,
  ...INIT_USER_APIPATH,
  ...INIT_BRAND_APIPATH,
  ...INIT_CATEGORY_APIPATH,
  ...INIT_PRODUCT_APIPATH,
  ...INIT_INVENTORY_APIPATH,
  ...INIT_PRICE_APIPATH,
  ...INIT_VARIANT_APIPATH,
  ...INIT_SUPPLIER_APIPATH,
  ...INIT_TAG_APIPATH,
  ...INIT_REVIEW_APIPATH,
  ...INIT_CART_APIPATH,
  ...INIT_CART_ITEM_APIPATH,
  ...INIT_ORDER_APIPATH,
  ...INIT_ORDER_ITEM_APIPATH,
];

export { USER_ROLE, ADMIN_ROLE, INIT_PERMISSIONS };
