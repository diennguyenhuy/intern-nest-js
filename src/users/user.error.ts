import { ArgumentsHost, Catch, ExceptionFilter, HttpStatus } from "@nestjs/common";
import type { Response } from "express";

export class EmailAlreadyExistsError extends Error {
    constructor(email: string, options?: ErrorOptions) {
        super(`User with email ${email} already exists`, options);
    }
}

@Catch(EmailAlreadyExistsError)
export class EmailAlreadyExistsFilter implements ExceptionFilter<EmailAlreadyExistsError> {
    catch(exception: EmailAlreadyExistsError, host: ArgumentsHost) {
        const ctx = host.switchToHttp();
        const response = ctx.getResponse<Response>();

        response.status(HttpStatus.CONFLICT).json({
            statusCode: HttpStatus.CONFLICT,
            error: 'Conflict',
            message: exception.message
        });
    }
}