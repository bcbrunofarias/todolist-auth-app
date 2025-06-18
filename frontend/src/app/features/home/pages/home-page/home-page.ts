import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';

import { RoutesConstants } from '@constants/routes.constants';

@Component({
  selector: 'app-home-page',
  imports: [],
  templateUrl: './home-page.html',
  styleUrl: './home-page.scss',
  standalone: true
})
export class HomePage {
  private readonly router = inject(Router);

  public onLoginNavigateClick(): void {
    this.router.navigate([RoutesConstants.LOGIN]);
  }

  public onTodoNavigateClick(): void {
    this.router.navigate([RoutesConstants.TODO]);
  }
}
