import { TestBed } from '@angular/core/testing';

import { MyButtonService } from './my-button.service';

describe('MyButtonService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MyButtonService = TestBed.get(MyButtonService);
    expect(service).toBeTruthy();
  });
});
