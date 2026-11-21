import { Module } from '@nestjs/common';
import { MicroserviceClientController } from './microservice-client.controller.js';
import { ClientsModule, Transport } from '@nestjs/microservices';

@Module({
  controllers: [MicroserviceClientController],
  imports: [
    ClientsModule.register([
      {
        name: 'GARDEN_SERVICE',
        transport: Transport.TCP,
        options: {
          host: '127.0.0.1',
          port: 3001,
        },
      },
    ]),
  ]
})
export class MicroserviceClientModule {}
