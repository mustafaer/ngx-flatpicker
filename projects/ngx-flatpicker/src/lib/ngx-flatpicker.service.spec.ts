import { TestBed } from '@angular/core/testing';

import { NgxFlatpickerService } from './ngx-flatpicker.service';

describe('NgxFlatpickerService', () => {
  let service: NgxFlatpickerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NgxFlatpickerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
