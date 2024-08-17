import { Controller, Get, Post, Body, Patch, Param, Delete, Inject, Query, ParseIntPipe, ParseUUIDPipe } from '@nestjs/common';
import { CreateOrderDto } from './dto/create-order.dto';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { PaginationDto } from 'src/common/dto/pagination.dto';
import { OrderPaginationDto } from './dto/order-pagination.dto';
import { OrderStatus } from './enum/order.enum';
import { StatusDto } from './dto/status.dto';
import { NATS_SERVICE } from 'src/config/services';

@Controller('orders')
export class OrdersController {
  constructor(

    @Inject(NATS_SERVICE) 
    private readonly client: ClientProxy

  ) {}

  @Post()
  create(@Body() createOrderDto: CreateOrderDto) {
    return this.client.send('createOrder', createOrderDto)
    .pipe(
      catchError(err => { throw new RpcException(err) })
    );
  }

  @Get()
  findAll(@Query() orderPaginationDto: OrderPaginationDto) {
    return this.client.send('findAllOrders', orderPaginationDto)
    .pipe(
      catchError(err => { throw new RpcException(err) })
    );
  }

  @Get('id/:id')
  findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.client.send('findOneOrder', { id })
    .pipe(
      catchError(err => { throw new RpcException(err) })
    );
  }

  @Get(':status')
  findAllByStatus(
    @Param() statusDto: StatusDto,
    @Query() paginationDto: PaginationDto
  ) {
    return this.client.send('findAllOrders', { status: statusDto.status, ...paginationDto })
    .pipe(
      catchError(err => { throw new RpcException(err) })
    );
  }

  @Patch(':id')
  changeStatus(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() statusDto: StatusDto 
  ) {
    return this.client.send('changeOrderStatus', { status: statusDto.status, id })
    .pipe(
      catchError(err => { throw new RpcException(err) })
    );
  }

  
}
