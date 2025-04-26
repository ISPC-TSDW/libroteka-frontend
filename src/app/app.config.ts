import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter, withComponentInputBinding } from '@angular/router';
import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './services/auth.interceptor';

import { routes } from './app.routes';
import { provideHttpClient, HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes, withComponentInputBinding()), ReactiveFormsModule, provideHttpClient(), importProvidersFrom(HttpClientModule), {provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true}]
};
