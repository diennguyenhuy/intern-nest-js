import { Injectable, NestMiddleware, Logger } from '@nestjs/common';
import type { NextFunction, Request, Response } from 'express';

@Injectable()
export class RequestLoggingMiddleware implements NestMiddleware {
  private readonly logger =  new Logger(RequestLoggingMiddleware.name);

  use(req: Request, res: Response, next: NextFunction) {
    const startTime = Date.now();
    const { method } = req;
    const url = req.path

    this.logger.log(`>> ${method} ${url}`);

    let responseFinished = false;

    res.once('finish', () => {
      responseFinished = true;
      const duration = Date.now() - startTime;
      this.logger.log(`<< ${method} ${url} ${res.statusCode} ${duration}ms`);
    })
    .once('close', () => {
      if (responseFinished || res.writableFinished) return;
      const duration = Date.now() - startTime;
      this.logger.warn(`<< ${method} ${url} connection closed before response completed after ${duration}ms`);
    })
    .on('error', (e) => {
      const duration = Date.now() - startTime;
      this.logger.error(`<< ${method} ${url} ${res.statusCode} error due to ${e.message} ${duration}ms`);
    });

    req.once('close', () => {
      if (req.complete) return;
      this.logger.warn(`[HTTP] ${method} ${url} request closed before the full message was received`);
    });

    next();
  }
}
