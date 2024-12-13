import { NestFactory, Reflector } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe, VersioningType } from '@nestjs/common';
import { TransformInterceptor } from '@/interceptor/tranform';
import { JwtAuthGuard } from '@/modules/auth/jwt-auth.guard';
import cookieParser from 'cookie-parser';
import compression from 'compression';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // VALIDATION
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true, // Loại bỏ các thuộc tính không khai báo trong DTO
      forbidNonWhitelisted: true, // Trả lỗi nếu có thuộc tính không khai báo trong DTO
      transform: true, // Tự động chuyển đổi kiểu dữ liệu
    }),
  );

  // MIDDLEWARE
  const reflector = app.get(Reflector);
  app.useGlobalInterceptors(new TransformInterceptor(reflector));
  app.useGlobalGuards(new JwtAuthGuard(reflector));

  app.use(cookieParser());
  app.use(compression());

  // STATIC FILE
  app.useStaticAssets(join(__dirname, '..', 'public'));
  //VERSIONING
  app.setGlobalPrefix('api');
  app.enableVersioning({
    type: VersioningType.URI,
    defaultVersion: ['1'],
  });
  app.enableCors({
    origin: 'http://localhost:3000', // Thay localhost:3000 bằng domain frontend của bạn
    methods: 'GET,POST,PUT,DELETE,PATCH',  // Các phương thức HTTP cho phép
    allowedHeaders: 'Content-Type,Authorization', // Các header cho phép
  });
  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
