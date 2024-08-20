import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { envs } from './config/envs';
import { Logger, RequestMethod, ValidationPipe } from '@nestjs/common';
import { RpcCustomExceptionFilter } from './common/exceptions/rpc-custom-exception.filter';

async function bootstrap() {
  const logger = new Logger('Main-Gateway');

  const app = await NestFactory.create(AppModule); 

  //lo del exclude del setGlobalPrefix se puso por el tema de google cloud con kubernetes, lo ultimo del curso, se explica de esto en la NOTA.txt que está en la carpeta de products-launcher del curso, pero pues es para que ese prefijo de /api excluya al endpoint de '', osea al endpoint raiz  con el metodo GET, ese endpoint lo tenemos en el modulo de health-check de este gateway-ms
  app.setGlobalPrefix('api', {
    exclude: [
      { path: '', method: RequestMethod.GET }
    ]
  });

  app.useGlobalPipes(  
    new ValidationPipe({ 
      whitelist: true, 
      forbidNonWhitelisted: true, 
    }) 
  );

  app.useGlobalFilters(new RpcCustomExceptionFilter()); 

  await app.listen(envs.port);
  logger.log(`Gateway running on port ${envs.port} with health-check`);
}
bootstrap();
