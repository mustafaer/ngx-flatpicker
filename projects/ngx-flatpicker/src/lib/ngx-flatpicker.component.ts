import {Component, AfterViewInit, forwardRef, input, viewChild, ElementRef, OnChanges, SimpleChanges} from '@angular/core';
import {CommonModule} from '@angular/common';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {FlatpickrOptions} from './flatpicker-options.interface';
import flatpickr from 'flatpickr';


@Component({
    selector: 'ngx-flatpickr',
    standalone: true,
    imports: [CommonModule],
    template: `
        <div class="ngx-flatpickr-input-container" #flatpickr>
            <input *ngIf="!hideButton()" class="ngx-flatpickr-input {{ addClass() }}" [placeholder]="placeholder()"
                   [tabindex]="tabindex()" type="text" (focus)="onFocus($event)" data-input>
            <ng-content></ng-content>
        </div>
    `,
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => NgxFlatpickrComponent),
            multi: true
        }
    ]
})
export class NgxFlatpickrComponent implements AfterViewInit, ControlValueAccessor, OnChanges {

    public flatpickr!: Object;
    flatpickrElement = viewChild<ElementRef>('flatpickr');

    config = input<FlatpickrOptions>({}, { alias: 'config' });
    placeholder = input<string>('', { alias: 'placeholder' });
    addClass = input<string>('', { alias: 'addClass' });
    setDate = input<string | Date | undefined>(undefined, { alias: 'setDate' });
    hideButton = input<boolean>(false, { alias: 'hideButton' });
    tabindex = input<number, any>(0, {
        alias: 'tabindex',
        transform: (v) => Number(v)
    });

    private defaultFlatpickrOptions: FlatpickrOptions = {
        wrap: true,
        clickOpens: true
    };

    private _value: any;

    onTouchedFn: Function = () => {
    };

    ///////////////////////////////////

    writeValue(value: any) {
        this._value = value;
        this.setDateFromInput(value, false);
    }

    registerOnChange(fn: any) {
        this.propagateChange = fn;
    }

    registerOnTouched(fn: any): void {
        this.onTouchedFn = fn;
    }

    propagateChange = (_: any) => {
    };

    ///////////////////////////////////

    setDateFromInput(date: any, triggerChange = true) {
        const el = this.flatpickrElement();
        if (el?.nativeElement?._flatpickr) {
            el.nativeElement._flatpickr.setDate(date, triggerChange);
        }
    }

    setAltInputPlaceholder(placeholder: string) {
        const el = this.flatpickrElement();
        if (el?.nativeElement?._flatpickr?.altInput) {
            el.nativeElement._flatpickr.altInput.setAttribute('placeholder', placeholder);
        }
    }

    ngAfterViewInit() {
        const configVal = this.config();
        const userOnChange = configVal?.onChange;
        const userOnClose = configVal?.onClose;

        if (configVal) {
            Object.assign(this.defaultFlatpickrOptions, configVal);
        }

        // Chain the flatpickr onChange hook to propagate changes to Angular's forms API
        this.defaultFlatpickrOptions.onChange = (selectedDates: any, dateStr: string, instance: any) => {
            let value: any = null;
            if (selectedDates && selectedDates.length > 0) {
                if (configVal?.mode === 'multiple' || configVal?.mode === 'range') {
                    value = selectedDates;
                } else {
                    value = selectedDates[0];
                }
            }
            this.propagateChange(value);
            if (userOnChange) {
                if (Array.isArray(userOnChange)) {
                    userOnChange.forEach(fn => fn(selectedDates, dateStr, instance));
                } else {
                    userOnChange(selectedDates, dateStr, instance);
                }
            }
        };

        // Chain the onClose hook to register touch events
        this.defaultFlatpickrOptions.onClose = (selectedDates: any, dateStr: string, instance: any) => {
            this.onTouchedFn();
            if (userOnClose) {
                if (Array.isArray(userOnClose)) {
                    userOnClose.forEach(fn => fn(selectedDates, dateStr, instance));
                } else {
                    userOnClose(selectedDates, dateStr, instance);
                }
            }
        };

        const el = this.flatpickrElement();
        if (el?.nativeElement) {
            this.flatpickr = flatpickr(el.nativeElement, this.defaultFlatpickrOptions);
        }

        if (this._value !== undefined && this._value !== null) {
            this.setDateFromInput(this._value, false);
        } else if (this.setDate()) {
            this.setDateFromInput(this.setDate(), false);
        }
    }

    ngOnChanges(changes: SimpleChanges) {
        const el = this.flatpickrElement();
        if (el?.nativeElement?._flatpickr) {
            if (changes.hasOwnProperty('setDate')
                && changes['setDate'].currentValue) {
                this.setDateFromInput(changes['setDate'].currentValue, true);
            }

            if (this.config()?.altInput
                && changes.hasOwnProperty('placeholder')
                && changes['placeholder'].currentValue) {
                this.setAltInputPlaceholder(changes['placeholder'].currentValue);
            }
        }
    }

    onFocus(event: any) {
        this.onTouchedFn();
    }
}