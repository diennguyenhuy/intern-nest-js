import { Module } from '@nestjs/common';
import { MicroserviceController } from './microservice.controller.js';
import { MicroserviceService } from './microservice.service.js';

@Module({
    controllers: [MicroserviceController],
    providers: [MicroserviceService],
})
export class MicroserviceModule {}
