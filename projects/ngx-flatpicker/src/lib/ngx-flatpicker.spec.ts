import {Component, ViewChild} from '@angular/core';
import {ComponentFixture, TestBed, fakeAsync, tick} from '@angular/core/testing';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {NgxFlatpickrComponent} from './ngx-flatpicker.component';
import {NgxFlatpickrDirective} from './flatpicker.directive';
import {FlatpickrOptions} from './flatpicker-options.interface';

// Test host component for NgxFlatpickrDirective
@Component({
    template: `
        <form [formGroup]="testForm">
            <input type="text" flatpickr [flatpickr]="options" [formControlName]="'dateControl'" [placeholder]="placeholder">
        </form>
    `,
    standalone: true,
    imports: [ReactiveFormsModule, NgxFlatpickrDirective]
})
class DirectiveHostComponent {
    options: FlatpickrOptions = {
        enableTime: false,
        dateFormat: 'Y-m-d',
        wrap: false
    };
    placeholder = 'Select date';
    testForm = new FormGroup({
        dateControl: new FormControl()
    });
}

// Test host component for NgxFlatpickrComponent
@Component({
    template: `
        <form [formGroup]="testForm">
            <ngx-flatpickr [config]="options" [formControlName]="'dateControl'" [placeholder]="placeholder"></ngx-flatpickr>
        </form>
    `,
    standalone: true,
    imports: [ReactiveFormsModule, NgxFlatpickrComponent]
})
class ComponentHostComponent {
    options: FlatpickrOptions = {
        enableTime: false,
        dateFormat: 'Y-m-d'
    };
    placeholder = 'Select date';
    testForm = new FormGroup({
        dateControl: new FormControl()
    });
}

describe('NgxFlatpicker Tests', () => {

    describe('NgxFlatpickrDirective', () => {
        let fixture: ComponentFixture<DirectiveHostComponent>;
        let component: DirectiveHostComponent;
        let inputEl: HTMLInputElement;

        beforeEach(async () => {
            await TestBed.configureTestingModule({
                imports: [ReactiveFormsModule, DirectiveHostComponent]
            }).compileComponents();

            fixture = TestBed.createComponent(DirectiveHostComponent);
            component = fixture.componentInstance;
            fixture.detectChanges();
            inputEl = fixture.nativeElement.querySelector('input');
        });

        it('should initialize flatpickr on the input element', () => {
            expect(inputEl).toBeTruthy();
            expect((inputEl as any)._flatpickr).toBeTruthy();
        });

        it('should sync form control value changes to the flatpickr instance', fakeAsync(() => {
            const testDate = new Date('2026-06-26');
            component.testForm.get('dateControl')!.setValue(testDate);
            fixture.detectChanges();
            tick();

            const fp = (inputEl as any)._flatpickr;
            expect(fp.selectedDates.length).toBe(1);
            expect(fp.selectedDates[0].getDate()).toBe(testDate.getDate());
            expect(fp.selectedDates[0].getMonth()).toBe(testDate.getMonth());
            expect(fp.selectedDates[0].getFullYear()).toBe(testDate.getFullYear());
        }));

        it('should sync flatpickr date selection back to the form control', fakeAsync(() => {
            const fp = (inputEl as any)._flatpickr;
            const testDate = new Date('2026-06-30');
            fp.setDate(testDate, true); // triggerChange = true
            fixture.detectChanges();
            tick();

            const controlValue = component.testForm.get('dateControl')!.value;
            expect(controlValue).toBeTruthy();
            expect(controlValue instanceof Date).toBe(true);
            expect(controlValue.getDate()).toBe(testDate.getDate());
        }));

        it('should dynamically update configuration options when input changes', fakeAsync(() => {
            const fp = (inputEl as any)._flatpickr;
            expect(fp.config.enableTime).toBe(false);

            component.options = { ...component.options, enableTime: true };
            fixture.detectChanges();
            tick();

            expect(fp.config.enableTime).toBe(true);
        }));

        it('should clear flatpickr value when form control is set to null', fakeAsync(() => {
            const fp = (inputEl as any)._flatpickr;
            fp.setDate(new Date('2026-06-26'), false);
            expect(fp.selectedDates.length).toBe(1);

            component.testForm.get('dateControl')!.setValue(null);
            fixture.detectChanges();
            tick();

            expect(fp.selectedDates.length).toBe(0);
        }));
    });

    describe('NgxFlatpickrComponent', () => {
        let fixture: ComponentFixture<ComponentHostComponent>;
        let component: ComponentHostComponent;

        beforeEach(async () => {
            await TestBed.configureTestingModule({
                imports: [ReactiveFormsModule, ComponentHostComponent]
            }).compileComponents();

            fixture = TestBed.createComponent(ComponentHostComponent);
            component = fixture.componentInstance;
            fixture.detectChanges();
        });

        it('should initialize flatpickr component', () => {
            const containerEl = fixture.nativeElement.querySelector('.ngx-flatpickr-input-container');
            expect(containerEl).toBeTruthy();
            expect(containerEl._flatpickr).toBeTruthy();
        });

        it('should set initial value programmatically and sync to flatpickr', fakeAsync(() => {
            const testDate = new Date('2026-06-26');
            component.testForm.get('dateControl')!.setValue(testDate);
            fixture.detectChanges();
            tick();

            const containerEl = fixture.nativeElement.querySelector('.ngx-flatpickr-input-container');
            const fp = containerEl._flatpickr;
            expect(fp.selectedDates.length).toBe(1);
            expect(fp.selectedDates[0].getDate()).toBe(testDate.getDate());
        }));

        it('should propagate flatpickr UI changes back to the form control', fakeAsync(() => {
            const containerEl = fixture.nativeElement.querySelector('.ngx-flatpickr-input-container');
            const fp = containerEl._flatpickr;
            const testDate = new Date('2026-07-05');
            fp.setDate(testDate, true);
            fixture.detectChanges();
            tick();

            const controlValue = component.testForm.get('dateControl')!.value;
            expect(controlValue).toBeTruthy();
            expect(controlValue instanceof Date).toBe(true);
            expect(controlValue.getDate()).toBe(testDate.getDate());
        }));
    });
});
