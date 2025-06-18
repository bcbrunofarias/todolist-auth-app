import { HttpErrorResponse } from '@angular/common/http';
import { Component, inject, OnInit, Signal, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { TodoPermissionService } from '@feat/todo/services/todo-permission/todo-permission.service';
import { AuthService } from '@services/auth/auth.service';
import { DecodedToken } from '@services/auth/decoded-token';
import { TodoResponse } from '@services/todo/todo.response';
import { TodoService } from '@services/todo/todo.service';
import { fadeInOutAnimation } from '@shared/animations/fade-in-out.animation';

import { TodoPermissionModel } from './todo-permission.model';


@Component({
  selector: 'app-todo-page',
  imports: [ReactiveFormsModule],
  templateUrl: './todo-page.html',
  styleUrl: './todo-page.scss',
  standalone: true,
  animations: [fadeInOutAnimation()]
})
export class TodoPage implements OnInit {
  private readonly todoService = inject(TodoService);
  private readonly authService = inject(AuthService);
  private readonly todoPermissionService = inject(TodoPermissionService);
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly router: Router = inject(Router);

  protected todos = signal<TodoResponse[]>([]);
  protected createTodoForm = this.formBuilder.group({
    title: ['', [Validators.required]],
    description: ['', [Validators.required]]
  });

  ngOnInit(): void {
    this.getTodos();
  }

  public onDeleteAllTodosClick(): void {
    this.todoService.deleteAll$().subscribe({
      next: () => this.todos.set([]),
      error: (error: HttpErrorResponse) => console.error('Ocorreu um erro ao remover todas as tarefas', error.message)
    });
  }

  public onDeleteTodoClick(id: string): void {
    this.todoService.delete$(id).subscribe({
      next: () => this.todos.update((todos: TodoResponse[]) => todos.filter(todo => todo.id != id)),
      error: (error: HttpErrorResponse) => console.error('Ocorreu um erro ao remover a tarefa selecionada!', error.message)
    });
  }

  public onTodoDetailsClick(id: string): void {
    this.router.navigate(['todos', id]);
  }

  public onCreateTodoForm(): void {
    if (!this.createTodoForm.valid) {
      console.error('Formulário inválido');
      return;
    }

    const title = this.createTodoForm.controls.title.value;
    const description = this.createTodoForm.controls.description.value;

    this.todoService.create$({ title, description }).subscribe({
      next: () => {
        this.getTodos();
        this.createTodoForm.reset();
      },
      error: (error: HttpErrorResponse) => console.error('Ocorreu um erro ao remover a tarefa selecionada!', error.message)
    });
  }

  public get todoPermissions(): Signal<TodoPermissionModel> {
    return this.todoPermissionService.permissions;
  }

  public get decodedToken(): DecodedToken | null {
    return this.authService.getDecodedToken$();
  }

  private getTodos(): void {
    this.todoService.getAll$().subscribe({
      next: (todos: TodoResponse[]) => this.todos.set(todos),
      error: (error: HttpErrorResponse) => console.error('Ocorreu um erro ao buscar tarefas.', error.message)
    });
  }
}
