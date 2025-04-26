import { Injectable } from '@angular/core';
import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
    constructor(private authService: AuthService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        const accessToken = this.authService.getAccessToken();

        if (accessToken) {
            const cloned = req.clone({
                setHeaders: {
                    Authorization: `Bearer ${accessToken}`
                }
            });
            return next.handle(cloned);
        }

        return next.handle(req);
    }
}