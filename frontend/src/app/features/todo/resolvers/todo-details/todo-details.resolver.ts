import { inject } from '@angular/core';
import { ResolveFn, Router } from '@angular/router';

import { RoutesConstants } from '@constants/routes.constants';
import { TodoResponse } from '@services/todo/todo.response';
import { TodoService } from '@services/todo/todo.service';

import { catchError, EMPTY, firstValueFrom } from 'rxjs';

export const todoDetailsResolver: ResolveFn<TodoResponse | void> = (route, state) => {
  const todoService = inject(TodoService);
  const router = inject(Router);

  const id = route.paramMap.get('id');
  if (!id) {
    router.navigate([RoutesConstants.ERRO.GENERICO]);
    return;
  }

  return firstValueFrom(todoService.getById$(id).pipe(
    catchError(() => {
      router.navigate([RoutesConstants.ERRO]);
      return EMPTY;
    })
  ));
};
