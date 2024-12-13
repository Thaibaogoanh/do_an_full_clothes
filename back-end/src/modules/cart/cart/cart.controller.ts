import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  ParseUUIDPipe,
  BadRequestException,
} from '@nestjs/common';
import { CartService } from './cart.service';
import { CreateCartDto } from './dto/create-cart.dto';
import { UpdateCartDto } from './dto/update-cart.dto';
import { PaginationDto } from '@/dto/pagination';
import { DUser } from '@/decorators/user';
import { Public } from '@/decorators/public';

@Controller('cart')
export class CartController {
  constructor(private readonly cartService: CartService) {}

  @Post()
  create(@Body() createCartDto: CreateCartDto, @DUser() user: UserByAccessToken) {
    return this.cartService.create(createCartDto, user.id);
  }

  @Get()
  findAll(@Query() query: PaginationDto) {
    return this.cartService.findAll(query);
  }

  @Get(':id')
  @Public()
  findOne(
    @Param(
      'id',
      new ParseUUIDPipe({
        exceptionFactory: () => new BadRequestException('Id không hợp lệ'),
      }),
    )
    id: string,
  ) {
    return this.cartService.findOne(id);
  }

  // @Patch(':id')
  // update(
  //   @Param(
  //     'id',
  //     new ParseUUIDPipe({
  //       exceptionFactory: () => new BadRequestException('Id không hợp lệ'),
  //     }),
  //   )
  //   id: string,
  //   @Body() updateCartDto: UpdateCartDto,
  // ) {
  //   return this.cartService.update(id, updateCartDto);
  // }

  @Patch(':id')
update(
  @Param(
    'id',
    new ParseUUIDPipe({
      exceptionFactory: () => new BadRequestException('Id không hợp lệ'),
    }),
  )
  id: string,
  @Body() updateCartDto: UpdateCartDto,
) {
  return this.cartService.update(id, updateCartDto);
}

  @Delete(':id')
  remove(
    @Param(
      'id',
      new ParseUUIDPipe({
        exceptionFactory: () => new BadRequestException('Id không hợp lệ'),
      }),
    )
    id: string,
  ) {
    return this.cartService.remove(id);
  }
}
