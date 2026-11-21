import { Controller } from '@nestjs/common';
import { MessagePattern } from '@nestjs/microservices';
import { MicroserviceService } from './microservice.service.js';

@Controller()
export class MicroserviceController {
    constructor(
        private readonly microserviceService: MicroserviceService,
    ) {}

    @MessagePattern('ping')
    handlePing(): string {
        return this.microserviceService.ping();
    }
}
