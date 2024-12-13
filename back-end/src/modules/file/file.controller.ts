import {
  Controller,
  PayloadTooLargeException,
  Post,
  UnprocessableEntityException,
  UploadedFile,
  UseFilters,
  UseInterceptors,
} from '@nestjs/common';
import { FileService } from './file.service';
import { FileInterceptor } from '@nestjs/platform-express';
import { Public } from '@/decorators/public';
import { PayloadTooLargeExceptionFilter } from '@/exception/file-too-large';

@Controller('file')
export class FileController {
  constructor(private readonly fileService: FileService) {}

  @Post('upload')
  @Public()
  @UseInterceptors(FileInterceptor('file'))
  @UseFilters(PayloadTooLargeExceptionFilter)
  uploadFile(@UploadedFile() file: Express.Multer.File) {
    return { filename: file.filename };
  }
}
