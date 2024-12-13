import { MulterModuleOptions, MulterOptionsFactory } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import path, { join } from 'path';
import fs from 'fs';
import { HttpException, HttpStatus, UnprocessableEntityException } from '@nestjs/common';

export default class MulterConfigService implements MulterOptionsFactory {
  createMulterOptions(): MulterModuleOptions {
    return {
      storage: diskStorage({
        destination: (req, file, cb) => {
          const module = req?.headers?.module ?? 'default';
          const feature = req?.headers?.feature ?? '';
          this.ensureExists(`public/${module}/${feature}`);
          cb(null, join(this.getRootPath(), `public/${module}/${feature}`));
        },
        filename: (req, file, cb) => {
          const fileName = req?.headers?.name ?? null;
          //get image extension
          const extName = path.extname(file.originalname);

          //get image's name (without extension)
          const baseName = path.basename(file.originalname, extName);

          const finalName = `${fileName ? fileName : baseName}-${Date.now()}${extName}`;
          cb(null, finalName);
        },
      }),
      fileFilter: (req, file, cb) => {
        const fileExtension = file.mimetype.split('/').shift().toLowerCase();
        const isValidFileType = fileExtension === 'image';

        if (!isValidFileType) {
          cb(
            new UnprocessableEntityException('Định dạng không được phép', {
              cause: new Error(),
              description: 'Invalid file type',
            }),
            null,
          );
        } else cb(null, true);
      },
      limits: {
        fileSize: 1024 * 1024 * 1, // 1MB
      },
    };
  }

  getRootPath = () => {
    return process.cwd();
  };

  ensureExists(targetDirectory: string) {
    fs.mkdir(targetDirectory, { recursive: true }, (error) => {
      if (!error) {
        return;
      }
      switch (error.code) {
        case 'EEXIST':
          // Error:
          // Requested location already exists, but it's not a directory.
          console.error(error);
          break;
        case 'ENOTDIR':
          // Error:
          // The parent hierarchy contains a file with the same name as the dir
          // you're trying to create.
          console.error(error);
          break;
        default:
          // Some other error like permission denied.
          console.error(error);
          break;
      }
    });
  }
}
