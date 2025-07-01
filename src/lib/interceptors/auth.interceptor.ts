import { 
  HttpInterceptorFn, 
  HttpErrorResponse, 
  HttpRequest, 
  HttpHandlerFn,
  HttpEvent 
} from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { catchError, throwError, Observable, from, firstValueFrom } from 'rxjs';
import { AuthApi } from '../login/api';

// List of public endpoints that don't need authentication
const PUBLIC_ENDPOINTS = [
  '/auth/public/login',
  '/auth/public/register',
  '/auth/public/verify',
  '/auth/public/refresh-token'
];

// List of protected endpoints that require authentication
const PROTECTED_ENDPOINTS = [
  '/auth/protected/verified/profile',
  '/conversion/upload',
  '/conversion',  // This covers all conversion endpoints
  '/sync' // This covers all sync endpoints
];

export const authInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn
): Observable<HttpEvent<unknown>> => {
  const router = inject(Router);
  
  // Skip auth header for public endpoints
  if (PUBLIC_ENDPOINTS.some(endpoint => req.url.includes(endpoint))) {
    return next(req);
  }

  const accessToken = localStorage.getItem('access_token');
  
  // For protected endpoints, redirect to login if no token
  if (PROTECTED_ENDPOINTS.some(endpoint => req.url.includes(endpoint)) && !accessToken) {
    router.navigate(['/login']);
    throw new Error('Authentication required');
  }

  if (!accessToken) {
    return next(req);
  }

  // Clone the request and add auth header
  const authReq = req.clone({
    headers: req.headers.set('Authorization', `Bearer ${accessToken}`)
  });

  return next(authReq).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        return from(handleUnauthorizedError(req, next, router));
      }
      return throwError(() => error);
    })
  );
};

async function handleUnauthorizedError(
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
  router: Router
): Promise<HttpEvent<unknown>> {
  const currentRefreshToken = localStorage.getItem('refresh_token');
  
  if (!currentRefreshToken) {
    router.navigate(['/login']);
    throw new Error('No refresh token available');
  }

  try {
    const response = await AuthApi.refreshToken({ refresh_token: currentRefreshToken });
    
    // Update stored tokens
    localStorage.setItem('access_token', response.access_token);
    localStorage.setItem('refresh_token', response.refresh_token);

    // Retry the original request with new token
    const newAuthReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${response.access_token}`)
    });
    
    return firstValueFrom(next(newAuthReq));
  } catch (error) {
    // If refresh fails, redirect to login
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    router.navigate(['/login']);
    throw error;
  }
} 