import { Component, inject, Signal } from '@angular/core';
import { Router, RouterLink, RouterOutlet } from '@angular/router';

import { RoutesConstants } from '@constants/routes.constants';
import { AuthService } from '@services/auth/auth.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink],
  templateUrl: './app.html',
  styleUrl: './app.scss',
  standalone: true
})
export class App {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  protected title = 'TodoList.APP';
  protected isAuthenticated$: Signal<boolean> = this.authService.isSignedIn$;

  public onLogoutClick(): void {
    this.authService.logout().subscribe({
      complete: () => this.router.navigate([RoutesConstants.HOME])
    });
  }
}
