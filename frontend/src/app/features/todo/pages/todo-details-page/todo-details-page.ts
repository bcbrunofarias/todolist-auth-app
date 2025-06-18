import { Component, inject, signal } from '@angular/core';
import { NonNullableFormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';

import { TodoResponse } from '@services/todo/todo.response';
import { TodoService } from '@services/todo/todo.service';
import { fadeInOutAnimation } from '@shared/animations/fade-in-out.animation';

import { timer } from 'rxjs';

@Component({
  selector: 'app-todo-details-page',
  imports: [ReactiveFormsModule],
  templateUrl: './todo-details-page.html',
  styleUrl: './todo-details-page.scss',
  standalone: true,
  animations: [fadeInOutAnimation()]
})
export class TodoDetailsPage {
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly formBuilder = inject(NonNullableFormBuilder);
  private readonly todoService = inject(TodoService);

  protected feedbackMessage = signal(false);
  protected selectedTodo = this.activatedRoute.snapshot.data['todo'] as TodoResponse;
  protected updateTodoForm = this.formBuilder.group({
    title: [this.selectedTodo.title, [Validators.required]],
    description: [this.selectedTodo.description, [Validators.required]]
  });

  public onSubmit(): void {
    if (!this.updateTodoForm.valid || !this.updateTodoForm.dirty) {
      return;
    }

    const description = this.updateTodoForm.controls.description.value;
    const title = this.updateTodoForm.controls.title.value;

    this.todoService.update$(this.selectedTodo.id, { title, description }).subscribe({
      next: () => {
        this.feedbackMessage.set(true);

        this.selectedTodo.title = title;
        this.selectedTodo.description = description;

        timer(3000).subscribe({
          next: () => this.feedbackMessage.set(false)
        });
      }
    })
  }
}
