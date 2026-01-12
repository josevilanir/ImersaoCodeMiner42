import { Injectable } from '@angular/core';
import {
  HttpRequest,
  HttpHandler,
  HttpEvent,
  HttpInterceptor,
  HttpErrorResponse
} from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Injectable()
export class JwtInterceptor implements HttpInterceptor {

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  intercept(request: HttpRequest<unknown>, next: HttpHandler): Observable<HttpEvent<unknown>> {
    // Pega o token do AuthService
    const token = this.authService.getToken();

    // Se tiver token, adiciona no header Authorization
    if (token) {
      request = request.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`
        }
      });
    }

    // Continua com a requisição e trata erros
    return next.handle(request).pipe(
      catchError((error: HttpErrorResponse) => {
        // Se retornar 401 (não autorizado), faz logout
        if (error.status === 401) {
          console.error('Token inválido ou expirado. Redirecionando para login...');
          this.authService.logout();
        }

        return throwError(() => error);
      })
    );
  }
}