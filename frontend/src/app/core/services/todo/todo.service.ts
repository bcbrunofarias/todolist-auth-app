import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';

import { environment } from '@env/environment';

import { Observable } from 'rxjs';
import { CreateTodoRequest } from './create-todo.request';
import { TodoResponse } from './todo.response';
import { UpdateTodoRequest } from './update-todo.request';

@Injectable({
  providedIn: 'root'
})
export class TodoService {
  private httpClient = inject(HttpClient);
  private urlEndpointTodo = `${environment.api.urlBase}/${environment.api.endpoints.todos}`;

  public getAll$(): Observable<TodoResponse[]> {
    return this.httpClient.get<TodoResponse[]>(this.urlEndpointTodo);
  }

  public create$(request: CreateTodoRequest): Observable<void> {
    return this.httpClient.post<void>(this.urlEndpointTodo, request);
  }

  public getById$(id: string): Observable<TodoResponse> {
    return this.httpClient.get<TodoResponse>(`${this.urlEndpointTodo}/${id}`);
  }

  public update$(id: string, request: UpdateTodoRequest): Observable<void> {
    return this.httpClient.put<void>(`${this.urlEndpointTodo}/${id}`, request);
  }

  public delete$(id: string): Observable<void> {
    return this.httpClient.delete<void>(`${this.urlEndpointTodo}/${id}`);
  }

  public deleteAll$(): Observable<void> {
    return this.httpClient.delete<void>(this.urlEndpointTodo);
  }
}
