import {Component, AfterViewInit, forwardRef, input, viewChild, ElementRef, signal, effect} from '@angular/core';
import {ControlValueAccessor, NG_VALUE_ACCESSOR} from '@angular/forms';
import {FlatpickrOptions} from './flatpicker-options.interface';
import flatpickr from 'flatpickr';


@Component({
    selector: 'ngx-flatpickr',
    standalone: true,
    imports: [],
    template: `
        <div class="ngx-flatpickr-wrapper">
            <div class="ngx-flatpickr-input-container" #flatpickr>
                @if (!hideButton()) {
                    <input 
                        class="ngx-flatpickr-input {{ addClass() }}" 
                        [placeholder]="placeholder()"
                        [tabindex]="tabindex()" 
                        type="text" 
                        (focus)="onFocus($event)" 
                        data-input
                    />
                }
                
                <!-- Toggle Button (Calendar Icon) -->
                <button type="button" class="ngx-flatpickr-btn ngx-flatpickr-toggle-btn" data-toggle aria-label="Toggle Calendar">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" class="ngx-flatpickr-icon">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5" />
                    </svg>
                </button>
                
                <!-- Clear Button (Trash/X Icon) -->
                <button type="button" class="ngx-flatpickr-btn ngx-flatpickr-clear-btn" data-clear aria-label="Clear Selection">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.8" stroke="currentColor" class="ngx-flatpickr-icon">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M6 18 18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>
            <ng-content></ng-content>
        </div>
    `,
    styles: [`
        .ngx-flatpickr-wrapper {
            display: inline-block;
            width: 100%;
            font-family: inherit;
        }
        .ngx-flatpickr-input-container {
            position: relative;
            display: flex;
            align-items: center;
            width: 100%;
            background-color: var(--ngx-fp-bg, #ffffff);
            border: 1px solid var(--ngx-fp-border, #e2e8f0);
            border-radius: 8px;
            transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
            box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
        }
        .ngx-flatpickr-input-container:hover {
            border-color: var(--ngx-fp-border-hover, #cbd5e1);
        }
        .ngx-flatpickr-input-container:focus-within {
            border-color: var(--ngx-fp-primary, #6366f1);
            box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15);
        }
        .ngx-flatpickr-input {
            width: 100%;
            padding: 10px 64px 10px 14px;
            font-size: 14px;
            line-height: 1.5;
            color: var(--ngx-fp-color, #1e293b);
            background: transparent;
            border: none;
            outline: none;
            border-radius: 8px;
        }
        .ngx-flatpickr-btn {
            position: absolute;
            display: flex;
            align-items: center;
            justify-content: center;
            padding: 4px;
            margin: 0;
            background: transparent;
            border: none;
            color: #64748b;
            cursor: pointer;
            transition: all 0.15s ease;
            outline: none;
            border-radius: 4px;
        }
        .ngx-flatpickr-btn:hover {
            color: #1e293b;
            background-color: rgba(0, 0, 0, 0.02);
        }
        .ngx-flatpickr-icon {
            width: 16px;
            height: 16px;
        }
        .ngx-flatpickr-toggle-btn {
            right: 10px;
        }
        .ngx-flatpickr-clear-btn {
            right: 36px;
            opacity: 0.7;
        }
        .ngx-flatpickr-clear-btn:hover {
            opacity: 1;
            color: #ef4444;
            background-color: rgba(239, 68, 68, 0.05);
        }
    `],
    providers: [
        {
            provide: NG_VALUE_ACCESSOR,
            useExisting: forwardRef(() => NgxFlatpickrComponent),
            multi: true
        }
    ]
})
export class NgxFlatpickrComponent implements AfterViewInit, ControlValueAccessor {

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
    protected isInitialized = signal(false);

    onTouchedFn: Function = () => {
    };

    constructor() {
        effect(() => {
            if (!this.isInitialized()) return;
            const dateVal = this.setDate();
            if (dateVal !== undefined) {
                this.setDateFromInput(dateVal, true);
            }
        });

        effect(() => {
            if (!this.isInitialized()) return;
            const placeholderVal = this.placeholder();
            if (this.config()?.altInput && placeholderVal) {
                this.setAltInputPlaceholder(placeholderVal);
            }
        });
    }

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

        this.isInitialized.set(true);

        if (this._value !== undefined && this._value !== null) {
            this.setDateFromInput(this._value, false);
        } else if (this.setDate()) {
            this.setDateFromInput(this.setDate(), false);
        }
    }

    onFocus(event: any) {
        this.onTouchedFn();
    }
}