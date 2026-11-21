import { Test, TestingModule } from '@nestjs/testing';
import { MicroserviceClientController } from './microservice-client.controller.js';

describe('MicroserviceClientController', () => {
  let controller: MicroserviceClientController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [MicroserviceClientController],
    }).compile();

    controller = module.get<MicroserviceClientController>(MicroserviceClientController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
