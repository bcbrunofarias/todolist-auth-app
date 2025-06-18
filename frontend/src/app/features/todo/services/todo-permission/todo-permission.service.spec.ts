import { TestBed } from '@angular/core/testing';

import { TodoPermissionService } from './todo-permission.service';

describe('TodoPermissionService', () => {
  let service: TodoPermissionService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TodoPermissionService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
