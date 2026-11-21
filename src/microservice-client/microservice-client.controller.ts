import { Controller, Get, Inject, ServiceUnavailableException } from '@nestjs/common';
import { ClientProxy } from '@nestjs/microservices';
import { firstValueFrom } from 'rxjs';

@Controller('microservice')
export class MicroserviceClientController {
    constructor(
        @Inject('GARDEN_SERVICE')
        private readonly client: ClientProxy,
    ) {}

    @Get('ping')
    async ping(): Promise<string> {
        try {
            return firstValueFrom(
                this.client.send<string, Record<string, never>>(
                    'ping',
                    {},
                )
            );
        } catch (e) {
            throw new ServiceUnavailableException('Garden Microservice is unavailable');
        }
    }
}
