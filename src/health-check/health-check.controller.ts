import { Controller, Get } from '@nestjs/common';

@Controller('/')
export class HealthCheckController {
    @Get()
    healthCheck() {
        return 'gateway-ms is up running';
    }
}
