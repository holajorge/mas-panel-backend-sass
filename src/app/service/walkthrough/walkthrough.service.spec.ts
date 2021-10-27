import { TestBed } from '@angular/core/testing';

import { WalkthroughService } from './walkthrough.service';

describe('WalkthroughService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: WalkthroughService = TestBed.get(WalkthroughService);
    expect(service).toBeTruthy();
  });
});
