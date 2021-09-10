import { TestBed } from '@angular/core/testing';

import { PreciosService } from './precios.service';

describe('PreciosService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PreciosService = TestBed.get(PreciosService);
    expect(service).toBeTruthy();
  });
});
