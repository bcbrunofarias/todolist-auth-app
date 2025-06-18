import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { ApplicationConfig, inject, provideAppInitializer, provideBrowserGlobalErrorListeners, provideZonelessChangeDetection } from '@angular/core';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter } from '@angular/router';

import { AuthService } from '@services/auth/auth.service';
import { lastValueFrom } from 'rxjs';
import { routes } from './app.routes';
import { authInterceptor } from './shared/interceptors/auth/auth-interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideBrowserGlobalErrorListeners(),
    provideZonelessChangeDetection(),
    provideRouter(routes),
    provideHttpClient(withFetch(), withInterceptors([authInterceptor])),
    provideAnimations(),
    provideAppInitializer(async () => {
      const authService = inject(AuthService);
      await lastValueFrom(authService.refreshToken());
    })
  ]
};
