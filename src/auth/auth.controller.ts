import { Body, Controller, Get, Inject, Post, Req, UseGuards } from '@nestjs/common';
import { ClientProxy, RpcException } from '@nestjs/microservices';
import { catchError } from 'rxjs';
import { NATS_SERVICE } from 'src/config/services';
import { RegisterUserDto } from './dto/register-user.dto';
import { LoginUserDto } from './dto/login-user.dto';
import { AuthGuard } from './guards/auth.guard';
import { User } from './decorators/user.decorator';
import { CurrentUser } from './interfaces/current-user.interface';
import { Token } from './decorators/token.decorator';

@Controller('auth')
export class AuthController {

  constructor(

    @Inject(NATS_SERVICE) 
    private readonly client: ClientProxy

  ) {}

  @Post('register') 
  registerUser(@Body() registerUserDto: RegisterUserDto) {
    return this.client.send('auth.register.user', registerUserDto)
    .pipe(
      catchError(err => { throw new RpcException(err) })
    );
  }

  @Post('login') 
  loginUser(@Body() loginUserDto: LoginUserDto) {
    return this.client.send('auth.login.user', loginUserDto)
    .pipe(
      catchError(err => { throw new RpcException(err) })
    );
  }

  @UseGuards(AuthGuard) 
  @Get('verify')
  verifyToken(@User() user: CurrentUser, @Token() token: string) { 
    return { user, token };
  }

}
