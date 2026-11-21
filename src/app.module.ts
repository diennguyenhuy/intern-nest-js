import { Module, MiddlewareConsumer, NestModule, RequestMethod } from '@nestjs/common';
import { createObserveModule } from '@nestjs/observe';
import { AppController } from './app.controller.js';
import { AppService } from './app.service.js';
import { UserModule } from './users/user.module.js';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module.js';
import { RequestLoggingMiddleware } from './common/middleware/request-logging.middleware.js';
import { ProfilesModule } from './profiles/profiles.module.js';
import { PostsModule } from './posts/posts.module.js';
import { AuthModule } from './auth/auth.module.js';
import { MicroserviceClientModule } from './microservice-client/microservice-client.module.js';
import Joi from 'joi';

export const { ObserveModule, ObserveInstrument } = createObserveModule();

@Module({
  imports: [
    // Distributed tracing, auto-correlated logs, request/job metrics, error
    // telemetry, alarms, and more — out of the box. Sign up at https://observe.nestjs.com
    ObserveModule.forRoot({
      appKey: 'YOUR_APP_KEY',
      appSecret: 'YOUR_APP_SECRET',
      serviceId: 'my-intern-app',
    }),
    UserModule,
    ConfigModule.forRoot({ 
      isGlobal: true,
      validationSchema: Joi.object({
        PORT: Joi.number().port().default(3000),
        DATABASE_URL: Joi.string().uri({
          scheme: ['postgresql', 'postgres'],
        }).required(),
        JWT_SECRET: Joi.string().min(32).required(),
      }),
      validationOptions: {
          abortEarly: false,
          allowUnknown: true,
      } as Record<string, unknown>,
    }),
    PrismaModule,
    ProfilesModule,
    PostsModule,
    AuthModule,
    MicroserviceClientModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule implements NestModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(RequestLoggingMiddleware)
    .forRoutes({
      path: '{*path}',
      method: RequestMethod.ALL,
    });
  }
}
