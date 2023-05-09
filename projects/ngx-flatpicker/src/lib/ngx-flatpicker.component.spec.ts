import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NgxFlatpickerComponent } from './ngx-flatpicker.component';

describe('NgxFlatpickerComponent', () => {
  let component: NgxFlatpickerComponent;
  let fixture: ComponentFixture<NgxFlatpickerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NgxFlatpickerComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NgxFlatpickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
