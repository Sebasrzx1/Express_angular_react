import { TestBed } from '@angular/core/testing';

import { RolesPermisos } from './roles-permisos';

describe('RolesPermisos', () => {
  let service: RolesPermisos;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RolesPermisos);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
