import { TestBed } from '@angular/core/testing';

import { RegistracionService } from './registracion.service';

describe('RegistracionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: RegistracionService = TestBed.get(RegistracionService);
    expect(service).toBeTruthy();
  });
});
