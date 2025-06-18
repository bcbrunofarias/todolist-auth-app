import { inject } from "@angular/core";

import { AuthService } from "@services/auth/auth.service";
import { lastValueFrom } from "rxjs";


export const initializeApp = (): () => Promise<void> => {
    const authService = inject(AuthService);
    return () => lastValueFrom(authService.refreshToken()).then(() => { });
}