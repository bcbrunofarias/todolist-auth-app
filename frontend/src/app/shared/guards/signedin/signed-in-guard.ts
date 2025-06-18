import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

import { RoutesConstants } from '@constants/routes.constants';
import { AuthService } from '@services/auth/auth.service';

export const signedInGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const isSignedIn = authService.isSignedIn;
  if (isSignedIn) {
    return true;
  }

  return router.createUrlTree([RoutesConstants.LOGIN]);
};
