import { TestBed } from '@angular/core/testing';

import { SuspectService } from './suspect.service';

describe('SuspectService', () => {
  let service: SuspectService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SuspectService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
