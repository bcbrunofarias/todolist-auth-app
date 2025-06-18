import { TestBed } from '@angular/core/testing';
import { CanActivateFn } from '@angular/router';

import { signedInGuard } from './signed-in-guard';

describe('signedinGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) => 
      TestBed.runInInjectionContext(() => signedInGuard(...guardParameters));

  beforeEach(() => {
    TestBed.configureTestingModule({});
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });
});
