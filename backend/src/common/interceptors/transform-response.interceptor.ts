import { Injectable, NestInterceptor, ExecutionContext, CallHandler } from '@nestjs/common';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

export interface Response<T> {
    success: boolean;
    timestamp: string;
    data: T;
}

@Injectable()
export class TransformResponseInterceptor<T> implements NestInterceptor<T, Response<T>> {
    intercept(context: ExecutionContext, next: CallHandler): Observable<Response<T>> {
        return next.handle().pipe(
            map(data => {
                if (data && typeof data === 'object' && 'success' in data && 'timestamp' in data) {
                    return data;
                }
                
                return {
                    success: true,
                    timestamp: new Date().toISOString(),
                    data,
                };
            })
        );
    }
} 
