import {HttpInterceptorFn, HttpErrorResponse} from '@angular/common/http';
import {inject} from '@angular/core';
import { AuthService } from '../../../features/auth/auth.services';
import { Router } from '@angular/router';
import { catchError, switchMap } from 'rxjs';

const REFRESH_ENDPOINT = '/auth/refresh';

export const refreshInterceptor: HttpInterceptorFn = (req, next) => {
    const auth = inject(AuthService);
    const router = inject(Router);
    const isRefreshRequest = req.url.startsWith(REFRESH_ENDPOINT);
    const reqAuth = req.clone({withCredentials: true});
    
    return next(reqAuth).pipe(
        catchError((error) => {
            if (error.status === 401 && !isRefreshRequest ) {
                return auth.refreshToken().pipe(
                    switchMap(() => {
                        auth.refreshSession();
                        
                        return next(reqAuth);
                    }),
                    catchError((err: HttpErrorResponse) => {
                        

                        throw err;
                        
                    })
                );
                }
            
                next(reqAuth);
                throw error;
            
        }
    )
);
}