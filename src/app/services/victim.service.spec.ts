import { TestBed } from '@angular/core/testing';

import { VictimService } from './victim.service';

describe('VictimService', () => {
  let service: VictimService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(VictimService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
