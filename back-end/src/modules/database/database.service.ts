import { ADMIN_ROLE, INIT_PERMISSIONS, USER_ROLE } from '@/modules/database/sample';
import { Permission } from '@/modules/permission/entities/permission.entity';
import { Brand } from '@/modules/product/brand/entities/brand.entity';
import { Role } from '@/modules/role/entities/role.entity';
import { User } from '@/modules/user/entities/user.entity';
import { UserService } from '@/modules/user/user.service';
import { Cache, CACHE_MANAGER } from '@nestjs/cache-manager';
import { Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Category } from '@/modules/product/category/entities/category.entity';
import { Supplier } from '@/modules/product/supplier/entities/supplier.entity';
import { Inventory } from '@/modules/product/inventory/entities/inventory.entity';
import { Price } from '@/modules/product/price/entities/price.entity';
import { Variant } from '@/modules/product/variant/entities/variant.entity';
import { Product } from '@/modules/product/product/entities/product.entity';
import { Review } from '@/modules/product/review/entities/review.entity';
import { Tag } from '@/modules/product/tag/entities/tag.entity';
import { INIT_CATEGORY_LEVEL_1, INIT_CATEGORY_LEVEL_2 } from '@/modules/database/modules/product/category';

/**
 * Thứ tự tạo các thông tin product
 * 1. Brand
 * 2. Category
 * 3. Supplier
 * 4. Variant
 * 5. Price
 * 6. Inventory
 * 7. Product
 * 8. Review
 * 9. Tag
 */

@Injectable()
export class DatabaseService implements OnModuleInit {
  constructor(
    @InjectRepository(Permission)
    private permissionRepository: Repository<Permission>,
    @InjectRepository(Role)
    private roleRepository: Repository<Role>,
    @InjectRepository(User)
    private userRepository: Repository<User>,
    @InjectRepository(Brand)
    private brandRepository: Repository<Brand>,
    @InjectRepository(Category)
    private categoryRepository: Repository<Category>,
    @InjectRepository(Supplier)
    private supplierRepository: Repository<Supplier>,
    @InjectRepository(Inventory)
    private inventoryRepository: Repository<Inventory>,
    @InjectRepository(Price)
    private priceRepository: Repository<Price>,
    @InjectRepository(Variant)
    private variantRepository: Repository<Variant>,
    @InjectRepository(Product)
    private productRepository: Repository<Product>,
    @InjectRepository(Review)
    private reviewRepository: Repository<Review>,
    @InjectRepository(Tag)
    private tagRepository: Repository<Tag>,

    private userService: UserService,
    @Inject(CACHE_MANAGER)
    private cacheManager: Cache,
  ) {}
  private readonly logger = new Logger('InitSampleData');

  onModuleInit = async () => {
    if (process.env.SHOULD_INIT !== 'true') {
      return;
    }

    if ((await this.permissionRepository.count()) === 0) {
      this.logger.log('Init permissions');
      await this.permissionRepository.save(INIT_PERMISSIONS);
    }

    if ((await this.roleRepository.count()) === 0) {
      this.logger.log('Init roles');
      const permissions = await this.permissionRepository.find();
      await this.roleRepository.save([
        {
          name: ADMIN_ROLE,
          description: 'Admin thì full quyền :v',
          isActivated: true,
          permissions: permissions,
        },
        {
          name: USER_ROLE,
          description: 'Người dùng sử dụng hệ thống',
          isActivated: true,
          permissions: [], //không set quyền, chỉ cần add ROLE
        },
      ]);
    }

    if ((await this.userRepository.count({ relations: ['contacts'] })) === 0) {
      this.logger.log('Init users');
      const adminRole = await this.roleRepository.findOneBy({
        name: ADMIN_ROLE,
      });
      const userRole = await this.roleRepository.findOneBy({
        name: USER_ROLE,
      });
      await this.cacheManager.set('userRole', userRole, 0);
      this.userRepository.save([
        {
          email: 'admin@gmail.com',
          password: this.userService.hashPassword(process.env.INIT_PASSWORD),
          age: 18,
          gender: 'male',
          role: adminRole,
          name: 'BAO',
        },
        {
          email: 'cqb@gmail.com',
          password: this.userService.hashPassword(process.env.INIT_PASSWORD),
          age: 18,
          gender: 'male',
          role: adminRole,
          name: 'CHAU QUOC BAO',
        },
        {
          email: 'user@gmail.com',
          password: this.userService.hashPassword(process.env.INIT_PASSWORD),
          age: 18,
          gender: 'male',
          role: userRole,
          name: 'CQB',
        },
      ]);
    }

    await this.initBrand();
    await this.initCategory();
    await this.initSupplier();
    await this.initProduct();
    await this.initVariant();
    await this.initPrice();
    await this.initInventory();
  };

  initBrand = async () => {
    if ((await this.brandRepository.count()) === 0) {
      this.logger.log('Init brands');
      await this.brandRepository.save([
        {
          name: 'SWE',
          description: `Được thành lập vào cuối năm 2016 trong bối cảnh thời trang streetstyle dần nhen nhóm vào thị trường Việt Nam. Sau 6 năm phát triển, SWE - Street Wear Eazy với slogan Young kids with a mission™ đã chiếm được tình cảm của hầu hết các bạn trẻ yêu mến thời trang đường phố trên khắp cả nước.`,
          isActivated: true,
        },
        {
          name: 'Now Saigon',
          description: `Thương hiệu thời trang NOWSAIGON (NOW - Needs Of Wisdom) có mặt tại TP.HCM từ năm 2015. Ngay từ ngày đầu thành lập, NOW đã xác định lối đi riêng khi tập trung vào các dòng sản phẩm streetwear (thời trang đường phố) với hình vẽ độc đáo, lồng ghép những thông điệp lan toả năng lượng tích cực đến giới trẻ.`,
          isActivated: true,
        },
        {
          name: 'HADES',
          description: `Hades là thương hiệu thời trang đường phố, được thành lập vào năm 2017. Hades mang đến một phong cách chất lừ cho giới trẻ, với những sản phẩm đa dạng, phong phú, đề cao sự sáng tạo và cá tính.`,
          isActivated: true,
        },
        {
          name: 'TSUN',
          description: `Thương hiệu thời trang TSUN ra đời vào năm 2017, TSUN mang đến cho giới trẻ những sản phẩm thời trang đường phố cá tính, năng động và phong cách.`,
          isActivated: true,
        },
      ]);
    }
  };

  initCategory = async () => {
    if ((await this.categoryRepository.count()) === 0) {
      this.logger.log('Init categories');
      await this.categoryRepository.save(INIT_CATEGORY_LEVEL_1);
      const ao = await this.categoryRepository.findOneBy({ name: 'Áo' });
      const quan = await this.categoryRepository.findOneBy({ name: 'Quần' });
      const giay = await this.categoryRepository.findOneBy({ name: 'Giày' });
      await this.categoryRepository.save(
        INIT_CATEGORY_LEVEL_2.map((category) => ({
          ...category,
          parent: { Áo: ao, Quần: quan, Giày: giay }[category.name.split(' ')[0]],
        })),
      );
      await this.categoryRepository.save([
        {
          name: 'Áo sơ mi nam',
          description: 'Áo sơ mi nam thời trang',
          isActivated: true,
          parent: await this.categoryRepository.findOneBy({ name: 'Áo sơ mi' }),
        },
        {
          name: 'Áo sơ mi nữ',
          description: 'Áo sơ mi nữ thời trang',
          isActivated: true,
          parent: await this.categoryRepository.findOneBy({ name: 'Áo sơ mi' }),
        },
        {
          name: 'Áo thun nam',
          description: 'Áo thun nam thời trang',
          isActivated: true,
          parent: await this.categoryRepository.findOneBy({ name: 'Áo thun' }),
        },
        {
          name: 'Áo thun nữ',
          description: 'Áo thun nữ thời trang',
          isActivated: true,
          parent: await this.categoryRepository.findOneBy({ name: 'Áo thun' }),
        },
        {
          name: 'Áo khoác nam',
          description: 'Áo khoác nam thời trang',
          isActivated: true,
          parent: await this.categoryRepository.findOneBy({ name: 'Áo khoác' }),
        },
        {
          name: 'Áo khoác nữ',
          description: 'Áo khoác nữ thời trang',
          isActivated: true,
          parent: await this.categoryRepository.findOneBy({ name: 'Áo khoác' }),
        },
        {
          name: 'Quần jean nam',
          description: 'Quần jean nam thời trang',
          isActivated: true,
          parent: await this.categoryRepository.findOneBy({ name: 'Quần jean' }),
        },
        {
          name: 'Quần jean nữ',
          description: 'Quần jean nữ thời trang',
          isActivated: true,
          parent: await this.categoryRepository.findOneBy({ name: 'Quần jean' }),
        },
        {
          name: 'Quần kaki nam',
          description: 'Quần kaki nam thời trang',
          isActivated: true,
          parent: await this.categoryRepository.findOneBy({ name: 'Quần kaki' }),
        },
        {
          name: 'Quần kaki nữ',
          description: 'Quần kaki nữ thời trang',
          isActivated: true,
          parent: await this.categoryRepository.findOneBy({ name: 'Quần kaki' }),
        },
        {
          name: 'Giày thể thao nam',
          description: 'Giày thể thao nam thời trang',
          isActivated: true,
          parent: await this.categoryRepository.findOneBy({ name: 'Giày thể thao' }),
        },
        {
          name: 'Giày thể thao nữ',
          description: 'Giày thể thao nữ thời trang',
          isActivated: true,
          parent: await this.categoryRepository.findOneBy({ name: 'Giày thể thao' }),
        },
        {
          name: 'Giày lười nam',
          description: 'Giày lười nam thời trang',
          isActivated: true,
          parent: await this.categoryRepository.findOneBy({ name: 'Giày lười' }),
        },
        {
          name: 'Giày lười nữ',
          description: 'Giày lười nữ thời trang',
          isActivated: true,
          parent: await this.categoryRepository.findOneBy({ name: 'Giày lười' }),
        },
        {
          name: 'Mũ nam',
          description: 'Mũ nam thời trang',
          isActivated: true,
          parent: await this.categoryRepository.findOneBy({ name: 'Mũ' }),
        },
        {
          name: 'Mũ nữ',
          description: 'Mũ nữ thời trang',
          isActivated: true,
          parent: await this.categoryRepository.findOneBy({ name: 'Mũ' }),
        },
        {
          name: 'Túi xách nam',
          description: 'Túi xách nam thời trang',
          isActivated: true,
          parent: await this.categoryRepository.findOneBy({ name: 'Túi xách' }),
        },
        {
          name: 'Túi xách nữ',
          description: 'Túi xách nữ thời trang',
          isActivated: true,
          parent: await this.categoryRepository.findOneBy({ name: 'Túi xách' }),
        },
      ]);
    }
  };
  initSupplier = async () => {
    if ((await this.supplierRepository.count()) === 0) {
      this.logger.log('Init suppliers');
      await this.supplierRepository.save([
        {
          name: 'SWE',
          description: `Được thành lập vào cuối năm 2016 trong bối cảnh thời trang streetstyle dần nhen nhóm vào thị trường Việt Nam. Sau 6 năm phát triển, SWE - Street Wear Eazy với slogan Young kids with a mission™ đã chiếm được tình cảm của hầu hết các bạn trẻ yêu mến thời trang đường phố trên khắp cả nước.`,
          address: ['Tòa nhà SWE'],
          phone: ['0921983192'],
          email: ['swe@gmail.com'],
          website: 'https://swe.vn',
        },
        {
          name: 'Now Saigon',
          description: `Thương hiệu thời trang NOWSAIGON (NOW - Needs Of Wisdom) có mặt tại TP.HCM từ năm 2015. Ngay từ ngày đầu thành lập, NOW đã xác định lối đi riêng khi tập trung vào các dòng sản phẩm streetwear (thời trang đường phố) với hình vẽ độc đáo, lồng ghép những thông điệp lan toả năng lượng tích cực đến giới trẻ.`,
          address: ['Tòa nhà NOW'],
          phone: ['0918239123'],
          email: ['now@gmail.com'],
          website: 'https://nowsaigon.com/',
        },
        {
          name: 'HADES',
          description: `Hades là thương hiệu thời trang đường phố, được thành lập vào năm 2017. Hades mang đến một phong cách chất lừ cho giới trẻ, với những sản phẩm đa dạng, phong phú, đề cao sự sáng tạo và cá tính.`,
          address: ['Tòa nhà HADES'],
          phone: ['0918132668'],
          email: ['hades@gmail.com'],
          website: 'https://hades.vn',
        },
        {
          name: 'TSUN',
          description: `Thương hiệu thời trang TSUN ra đời vào năm 2017, TSUN mang đến cho giới trẻ những sản phẩm thời trang đường phố cá tính, năng động và phong cách.`,
          address: ['Tòa nhà TSUN'],
          phone: ['0981320022'],
          email: ['tsun@gmail.com'],
          website: 'https://tsunsg.com',
        },
      ]);
    }
  };

  initProduct = async () => {
    if ((await this.productRepository.count()) === 0) {
      this.logger.log('Init products');
      const category = await this.categoryRepository.findOneBy({ name: 'Áo sơ mi nam' });
      await this.productRepository.save([
        {
          name: 'Áo sơ mi nam SWE',
          description: `Áo sơ mi nam SWE với chất liệu vải cotton thoáng mát, kiểu dáng slimfit, cổ bẻ, tay dài, phối họa tiết dễ thương, màu sắc trẻ trung, năng động, phù hợp với mọi lứa tuổi.`,
          material: 'Cotton',
          brand: await this.brandRepository.findOneBy({ name: 'SWE' }),
          supplier: await this.supplierRepository.findOneBy({ name: 'SWE' }),
          category: category,
        },
        {
          name: 'Áo sơ mi nam NOW',
          description: `Áo sơ mi nam NOW với chất liệu vải cotton thoáng mát, kiểu dáng slimfit, cổ bẻ, tay dài, phối họa tiết dễ thương, màu sắc trẻ trung, năng động, phù hợp với mọi lứa tuổi.`,
          material: 'Cotton',
          brand: await this.brandRepository.findOneBy({ name: 'Now Saigon' }),
          supplier: await this.supplierRepository.findOneBy({ name: 'Now Saigon' }),
          category: category,
        },
        {
          name: 'Áo sơ mi nam HADES',
          description: `Áo sơ mi nam HADES với chất liệu vải cotton thoáng mát, kiểu dáng slimfit, cổ bẻ, tay dài, phối họa tiết dễ thương, màu sắc trẻ trung, năng động, phù hợp với mọi lứa tuổi.`,
          material: 'Cotton',
          brand: await this.brandRepository.findOneBy({ name: 'HADES' }),
          supplier: await this.supplierRepository.findOneBy({ name: 'HADES' }),
          category: category,
        },
        {
          name: 'Áo sơ mi nam TSUN',
          description: `Áo sơ mi nam TSUN với chất liệu vải cotton thoáng mát, kiểu dáng slimfit, cổ bẻ, tay dài, phối họa tiết dễ thương, màu sắc trẻ trung, năng động, phù hợp với mọi lứa tuổi.`,
          material: 'Cotton',
          brand: await this.brandRepository.findOneBy({ name: 'TSUN' }),
          supplier: await this.supplierRepository.findOneBy({ name: 'TSUN' }),
          category: category,
        },
      ]);
    }
  };

  initVariant = async () => {
    if ((await this.variantRepository.count()) === 0) {
      this.logger.log('Init variants');
      await this.variantRepository.save([
        {
          name: 'Áo sơ mi nam SWE Đen M',
          sku: 'SWE-001',
          barcode: 'SWE-001',
          colorName: 'Đen',
          colorCode: '#000000',
          size: 'M',
          quantity: 10,
          mainImage: '/variant/SWE-TSHIRT-BLACK-M.webp',
          images: [
            '/variant/SWE-TSHIRT-BLACK.webp',
            '/variant/SWE-TSHIRT-BLACK-1.webp',
            '/variant/SWE-TSHIRT-BLACK-2.webp',
          ],
          prices: [],
          inventories: [],
          product: await this.productRepository.findOneBy({ name: 'Áo sơ mi nam SWE' }),
        },
        {
          name: 'Áo sơ mi nam SWE Đen L',
          sku: 'SWE-002',
          barcode: 'SWE-002',
          colorName: 'Đen',
          colorCode: '#000000',
          size: 'L',
          quantity: 10,
          mainImage: '/variant/SWE-TSHIRT-BLACK.webp',
          images: [
            '/variant/SWE-TSHIRT-BLACK.webp',
            '/variant/SWE-TSHIRT-BLACK-1.webp',
            '/variant/SWE-TSHIRT-BLACK-2.webp',
          ],
          prices: [],
          inventories: [],
          product: await this.productRepository.findOneBy({ name: 'Áo sơ mi nam SWE' }),
        },
        {
          name: 'Áo sơ mi nam SWE Đen XL',
          sku: 'SWE-003',
          barcode: 'SWE-003',
          colorName: 'Đen',
          colorCode: '#000000',
          size: 'XL',
          quantity: 10,
          mainImage: '/variant/SWE-TSHIRT-BLACK-M.webp',
          images: [
            '/variant/SWE-TSHIRT-BLACK-M.webp',
            '/variant/SWE-TSHIRT-BLACK-M-1.webp',
            '/variant/SWE-TSHIRT-BLACK-M-2.webp',
          ],
          prices: [],
          inventories: [],
          product: await this.productRepository.findOneBy({ name: 'Áo sơ mi nam SWE' }),
        },
        {
          name: 'Áo sơ mi nam NOW Đen M',
          sku: 'NOW-001',
          barcode: 'NOW-001',
          colorName: 'Đen',
          colorCode: '#000000',
          size: 'M',
          quantity: 10,
          mainImage: '/variant/NOW-TSHIRT-BLACK-M.webp',
          images: ['/variant/NOW-TSHIRT-BLACK-M.webp', '/variant/NOW-TSHIRT-BLACK-M-1.webp'],
          prices: [],
          inventories: [],
          product: await this.productRepository.findOneBy({ name: 'Áo sơ mi nam NOW' }),
        },
        {
          name: 'Áo sơ mi nam NOW Đen L',
          sku: 'NOW-002',
          barcode: 'NOW-002',
          colorName: 'Đen',
          colorCode: '#000000',
          size: 'L',
          quantity: 10,
          mainImage: '/variant/NOW-TSHIRT-BLACK-M.webp',
          images: ['/variant/NOW-TSHIRT-BLACK-M.webp', '/variant/NOW-TSHIRT-BLACK-M-1.webp'],
          prices: [],
          inventories: [],
          product: await this.productRepository.findOneBy({ name: 'Áo sơ mi nam NOW' }),
        },
        {
          name: 'Áo sơ mi nam NOW Đen XL',
          sku: 'NOW-003',
          barcode: 'NOW-003',
          colorName: 'Đen',
          colorCode: '#000000',
          size: 'XL',
          quantity: 10,
          mainImage: '/variant/NOW-TSHIRT-BLACK-M.webp',
          images: ['/variant/NOW-TSHIRT-BLACK-M.webp', '/variant/NOW-TSHIRT-BLACK-M-1.webp'],
          prices: [],
          inventories: [],
          product: await this.productRepository.findOneBy({ name: 'Áo sơ mi nam NOW' }),
        },
        {
          name: 'Áo sơ mi nam HADES Đen M',
          sku: 'HADES-001',
          barcode: 'HADES-001',
          colorName: 'Đen',
          colorCode: '#000000',
          size: 'M',
          quantity: 10,
          mainImage: '/variant/HADES-TSHIRT-PINK.webp',
          images: [
            '/variant/HADES-TSHIRT-PINK.webp',
            '/variant/HADES-TSHIRT-PINK-1.webp',
            '/variant/HADES-TSHIRT-PINK-2.webp',
          ],
          prices: [],
          inventories: [],
          product: await this.productRepository.findOneBy({ name: 'Áo sơ mi nam HADES' }),
        },
        {
          name: 'Áo sơ mi nam HADES Đen L',
          sku: 'HADES-002',
          barcode: 'HADES-002',
          colorName: 'Đen',
          colorCode: '#000000',
          size: 'L',
          quantity: 10,
          mainImage: '/variant/HADES-TSHIRT-PINK.webp',
          images: [
            '/variant/HADES-TSHIRT-PINK.webp',
            '/variant/HADES-TSHIRT-PINK-1.webp',
            '/variant/HADES-TSHIRT-PINK-2.webp',
          ],
          prices: [],
          inventories: [],
          product: await this.productRepository.findOneBy({ name: 'Áo sơ mi nam HADES' }),
        },
        {
          name: 'Áo sơ mi nam HADES Đen XL',
          sku: 'HADES-003',
          barcode: 'HADES-003',
          colorName: 'Đen',
          colorCode: '#000000',
          size: 'XL',
          quantity: 10,
          mainImage: '/variant/HADES-TSHIRT-PINK.webp',
          images: [
            '/variant/HADES-TSHIRT-PINK.webp',
            '/variant/HADES-TSHIRT-PINK-1.webp',
            '/variant/HADES-TSHIRT-PINK-2.webp',
          ],
          prices: [],
          inventories: [],
          product: await this.productRepository.findOneBy({ name: 'Áo sơ mi nam HADES' }),
        },
        {
          name: 'Áo sơ mi nam TSUN Đen M',
          sku: 'TSUN-001',
          barcode: 'TSUN-001',
          colorName: 'Đen',
          colorCode: '#000000',
          size: 'M',
          quantity: 10,
          mainImage: '/variant/TSUN-TSHIRT-BLACK.webp',
          images: [
            '/variant/TSUN-TSHIRT-BLACK.webp',
            '/variant/TSUN-TSHIRT-BLACK-1.webp',
            '/variant/TSUN-TSHIRT-BLACK-2.webp',
          ],
          prices: [],
          inventories: [],
          product: await this.productRepository.findOneBy({ name: 'Áo sơ mi nam TSUN' }),
        },
        {
          name: 'Áo sơ mi nam TSUN Đen L',
          sku: 'TSUN-002',
          barcode: 'TSUN-002',
          colorName: 'Đen',
          colorCode: '#000000',
          size: 'L',
          quantity: 10,
          mainImage: '/variant/TSUN-TSHIRT-BLACK.webp',
          images: [
            '/variant/TSUN-TSHIRT-BLACK.webp',
            '/variant/TSUN-TSHIRT-BLACK-1.webp',
            '/variant/TSUN-TSHIRT-BLACK-2.webp',
          ],
          prices: [],
          inventories: [],
          product: await this.productRepository.findOneBy({ name: 'Áo sơ mi nam TSUN' }),
        },
        {
          name: 'Áo sơ mi nam TSUN Đen XL',
          sku: 'TSUN-003',
          barcode: 'TSUN-003',
          colorName: 'Đen',
          colorCode: '#000000',
          size: 'XL',
          quantity: 10,
          mainImage: '/variant/TSUN-TSHIRT-BLACK.webp',
          images: [
            '/variant/TSUN-TSHIRT-BLACK.webp',
            '/variant/TSUN-TSHIRT-BLACK-1.webp',
            '/variant/TSUN-TSHIRT-BLACK-2.webp',
          ],
          prices: [],
          inventories: [],
          product: await this.productRepository.findOneBy({ name: 'Áo sơ mi nam TSUN' }),
        },
      ] as Variant[]);
    }
  };

  initPrice = async () => {
    if ((await this.priceRepository.count()) === 0) {
      this.logger.log('Init prices');
      await this.priceRepository.save([
        {
          price: 100000,
          currency: 'VND',
          effectiveDate: new Date(),
          variant: await this.variantRepository.findOneBy({ sku: 'SWE-001' }),
        },
        {
          price: 200000,
          currency: 'VND',
          effectiveDate: new Date(),
          variant: await this.variantRepository.findOneBy({ sku: 'SWE-002' }),
        },
        {
          price: 300000,
          currency: 'VND',
          effectiveDate: new Date(),
          variant: await this.variantRepository.findOneBy({ sku: 'SWE-003' }),
        },
        {
          price: 100000,
          currency: 'VND',
          effectiveDate: new Date(),
          variant: await this.variantRepository.findOneBy({ sku: 'NOW-001' }),
        },
        {
          price: 200000,
          currency: 'VND',
          effectiveDate: new Date(),
          variant: await this.variantRepository.findOneBy({ sku: 'NOW-002' }),
        },
        {
          price: 300000,
          currency: 'VND',
          effectiveDate: new Date(),
          variant: await this.variantRepository.findOneBy({ sku: 'NOW-003' }),
        },
        {
          price: 100000,
          currency: 'VND',
          effectiveDate: new Date(),
          variant: await this.variantRepository.findOneBy({ sku: 'HADES-001' }),
        },
        {
          price: 200000,
          currency: 'VND',
          effectiveDate: new Date(),
          variant: await this.variantRepository.findOneBy({ sku: 'HADES-002' }),
        },
        {
          price: 300000,
          currency: 'VND',
          effectiveDate: new Date(),
          variant: await this.variantRepository.findOneBy({ sku: 'HADES-003' }),
        },
        {
          price: 100000,
          currency: 'VND',
          effectiveDate: new Date(),
          variant: await this.variantRepository.findOneBy({ sku: 'TSUN-001' }),
        },
        {
          price: 200000,
          currency: 'VND',
          effectiveDate: new Date(),
          variant: await this.variantRepository.findOneBy({ sku: 'TSUN-002' }),
        },
        {
          price: 300000,
          currency: 'VND',
          effectiveDate: new Date(),
          variant: await this.variantRepository.findOneBy({ sku: 'TSUN-003' }),
        },
      ] as Price[]);
    }
  };

  initInventory = async () => {
    if ((await this.inventoryRepository.count()) === 0) {
      this.logger.log('Init inventories');
      await this.inventoryRepository.save([
        {
          quantity: 10,
          location: 'Kho SWE',
          variant: await this.variantRepository.findOneBy({ sku: 'SWE-001' }),
        },
        {
          quantity: 20,
          location: 'Kho SWE',
          variant: await this.variantRepository.findOneBy({ sku: 'SWE-002' }),
        },
        {
          quantity: 30,
          location: 'Kho SWE',
          variant: await this.variantRepository.findOneBy({ sku: 'SWE-003' }),
        },
        {
          quantity: 10,
          location: 'Kho NOW',
          variant: await this.variantRepository.findOneBy({ sku: 'NOW-001' }),
        },
        {
          quantity: 20,
          location: 'Kho NOW',
          variant: await this.variantRepository.findOneBy({ sku: 'NOW-002' }),
        },
        {
          quantity: 30,
          location: 'Kho NOW',
          variant: await this.variantRepository.findOneBy({ sku: 'NOW-003' }),
        },
        {
          quantity: 10,
          location: 'Kho HADES',
          variant: await this.variantRepository.findOneBy({ sku: 'HADES-001' }),
        },
        {
          quantity: 20,
          location: 'Kho HADES',
          variant: await this.variantRepository.findOneBy({ sku: 'HADES-002' }),
        },
        {
          quantity: 30,
          location: 'Kho HADES',
          variant: await this.variantRepository.findOneBy({ sku: 'HADES-003' }),
        },
        {
          quantity: 10,
          location: 'Kho TSUN',
          variant: await this.variantRepository.findOneBy({ sku: 'TSUN-001' }),
        },
        {
          quantity: 20,
          location: 'Kho TSUN',
          variant: await this.variantRepository.findOneBy({ sku: 'TSUN-002' }),
        },
        {
          quantity: 30,
          location: 'Kho TSUN',
          variant: await this.variantRepository.findOneBy({ sku: 'TSUN-003' }),
        },
      ] as Inventory[]);
    }
  };
}
