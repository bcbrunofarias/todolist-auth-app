import { Component, inject } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';

import { RoutesConstants } from '@constants/routes.constants';
import { AuthService } from '@services/auth/auth.service';

@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule],
  templateUrl: './login-page.html',
  styleUrl: './login-page.scss',
  standalone: true
})
export class LoginPage {
  private authService = inject(AuthService);
  private formBuilder = inject(NonNullableFormBuilder);
  private router = inject(Router);
  private activatedRoute = inject(ActivatedRoute);

  private returnUrl = this.activatedRoute.snapshot.queryParamMap.get('returnUrl') || RoutesConstants.HOME;
  protected loginForm = this.formBuilder.group({
    username: ['', [Validators.required]],
    password: ['', [Validators.required]]
  });

  public onSubmit(): void {
    if (!this.loginForm.valid) {
      console.error('Formulário inválido');
      return;
    }

    const username = this.loginForm.controls.username.value;
    const password = this.loginForm.controls.password.value;

    this.authService.login({ username, password }).subscribe({
      next: () => this.router.navigate([this.returnUrl])
    });
  }
}
