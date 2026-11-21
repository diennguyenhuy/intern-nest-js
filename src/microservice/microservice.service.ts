import { Injectable } from '@nestjs/common';

@Injectable()
export class MicroserviceService {
    ping(): string {
        return 'pong';
    }
}
