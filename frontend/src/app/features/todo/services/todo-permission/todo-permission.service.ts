import { computed, inject, Injectable, signal } from '@angular/core';

import { TodoPermissionModel } from '@feat/todo/pages/todo-page/todo-permission.model';
import { AuthService } from '@services/auth/auth.service';
import { DecodedToken } from '@services/auth/decoded-token';

@Injectable({
  providedIn: 'root'
})
export class TodoPermissionService {
  private readonly decodedToken = signal<DecodedToken | null>(null);
  private readonly authService = inject(AuthService);

  public readonly permissions = computed<TodoPermissionModel>(() => {
    const decodedToken = this.decodedToken();
    if (!decodedToken) {
      return {
        canDeleteTodo: false,
        canDeleteAllTodo: false
      }
    }

    return {
      canDeleteTodo: decodedToken.permissions.includes('CanDelete'),
      canDeleteAllTodo: decodedToken.permissions.includes('CanDelete') && decodedToken.roles.includes('Admin')
    }
  });

  constructor() {
    this.decodedToken.set(this.authService.getDecodedToken$());
  }
}
