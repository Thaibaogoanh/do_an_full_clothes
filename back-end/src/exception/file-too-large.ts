import { ExceptionFilter, Catch, ArgumentsHost, PayloadTooLargeException } from '@nestjs/common';
import { Response } from 'express';

@Catch(PayloadTooLargeException)
export class PayloadTooLargeExceptionFilter implements ExceptionFilter {
  catch(exception: PayloadTooLargeException, host: ArgumentsHost) {
    const ctx = host.switchToHttp();
    const response = ctx.getResponse<Response>();
    const status = exception.getStatus();

    response.status(status).json({
      statusCode: status,
      message: 'Tệp quá lớn',
      error: 'Payload Too Large',
    });
  }
}
