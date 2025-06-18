import { TestBed } from '@angular/core/testing';
import { ResolveFn } from '@angular/router';

import { todoDetailsResolver } from './todo-details.resolver';

describe('todoDetailsResolverResolver', () => {
  const executeResolver: ResolveFn<boolean> = (...resolverParameters) =>
    TestBed.runInInjectionContext(() => todoDetailsResolver(...resolverParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeResolver).toBeTruthy();
  });
});
