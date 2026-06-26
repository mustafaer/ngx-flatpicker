import {
    AfterViewInit, Directive, ElementRef, OnDestroy, OnInit,
    Renderer2, inject, input, output, effect, signal
} from '@angular/core';
import {ControlContainer, FormControl, NgControl} from '@angular/forms';
import {Subscription} from 'rxjs';
import {FlatpickrEvent} from './flatpicker-event.interface';
import {FlatpickrInstance} from './flatpicker-instance';
import {FlatpickrOptions} from './flatpicker-options.interface';
import {Hook} from 'flatpickr/dist/types/options';
import flatpickr from 'flatpickr';

@Directive({
    selector: '[flatpickr]',
    exportAs: 'ngx-flatpickr',
    standalone: true,
    host: {
        '(dblclick)': 'onClick()'
    }
})
export class NgxFlatpickrDirective implements AfterViewInit, OnDestroy, OnInit {
    /**
     * The flatpickr configuration as a single object of values.
     *
     * See https://chmln.github.io/flatpickr/options/ for full list.
     */
    flatpickrOptions = input<FlatpickrOptions>({}, { alias: 'flatpickr' });

    /**
     * Placeholder for input field.
     */
    placeholder = input<string | undefined>(undefined, { alias: 'placeholder' });

    /**
     * Exactly the same as date format, but for the altInput field.
     */
    flatpickrAltFormat = input<string | undefined>(undefined, { alias: 'altFormat' });

    /**
     * Show the user a readable date (as per altFormat), but return something
     * totally different to the server.
     */
    flatpickrAltInput = input<boolean | undefined>(undefined, { alias: 'altInput' });

    /**
     * This class will be added to the input element created by the altInput
     * option.
     */
    flatpickrAltInputClass = input<string | undefined>(undefined, { alias: 'altInputClass' });

    /**
     * Allows the user to enter a date directly input the input field. By
     * default, direct entry is disabled.
     */
    flatpickrAllowInput = input<boolean | undefined>(undefined, { alias: 'allowInput' });

    /**
     * Instead of body, appends the calendar to the specified node instead.
     */
    flatpickrAppendTo = input<any | undefined>(undefined, { alias: 'appendTo' }); // HTMLElement

    /**
     * Whether clicking on the input should open the picker.
     */
    flatpickrClickOpens = input<boolean | undefined>(undefined, { alias: 'clickOpens' });

    /**
     * A string of characters which are used to define how the date will be
     * displayed in the input box.
     */
    flatpickrDateFormat = input<string | undefined>(undefined, { alias: 'dateFormat' });

    /**
     * Sets the initial selected date(s).
     */
    flatpickrDefaultDate = input<string | Date | undefined>(undefined, { alias: 'defaultDate' });

    /**
     * Disable an array of specific dates, date ranges, or functions to disable
     * dates.
     */
    flatpickrDisable = input<string[] | Date[] | undefined>(undefined, { alias: 'disable' });

    /**
     * Set disableMobile to true to always use the non-native picker.
     */
    flatpickrDisableMobile = input<boolean | undefined>(undefined, { alias: 'disableMobile' });

    /**
     * Enable an array of specific dates, date ranges, or functions to enable
     * dates.
     */
    flatpickrEnable = input<string[] | Date[] | undefined>(undefined, { alias: 'enable' });

    /**
     * Enables time picker.
     */
    flatpickrEnableTime = input<boolean | undefined>(undefined, { alias: 'enableTime' });

    /**
     * Enables seconds in the time picker.
     */
    flatpickrEnableSeconds = input<boolean | undefined>(undefined, { alias: 'enableSeconds' });

    /**
     * Adjusts the step for the hour input (incl. scrolling).
     */
    flatpickrHourIncrement = input<number | undefined>(undefined, { alias: 'hourIncrement' });

    /**
     * Displays the calendar inline.
     */
    flatpickrInline = input<boolean | undefined>(undefined, { alias: 'inline' });

    /**
     * Use a specific locale for the flatpickr instance.
     */
    flatpickrLocale = input<Object | undefined>(undefined, { alias: 'locale' });

    /**
     * The maximum date that a user can pick to (inclusive).
     */
    flatpickrMaxDate = input<string | Date | undefined>(undefined, { alias: 'maxDate' });

    /**
     * The minimum date that a user can start picking from (inclusive).
     */
    flatpickrMinDate = input<string | Date | undefined>(undefined, { alias: 'minDate' });

    /**
     * Adjusts the step for the minute input (incl. scrolling).
     */
    flatpickrMinuteIncrement = input<number | undefined>(undefined, { alias: 'minuteIncrement' });

    /**
     * "single", "multiple", or "range"
     */
    flatpickrMode = input<string | undefined>(undefined, { alias: 'mode' });

    /**
     * HTML for the arrow icon, used to switch months.
     */
    flatpickrNextArrow = input<string | undefined>(undefined, { alias: 'nextArrow' });

    /**
     * Hides the day selection in calendar. Use it along with enableTime to
     * create a time picker.
     */
    flatpickrNoCalendar = input<boolean | undefined>(undefined, { alias: 'noCalendar' });

    /**
     * Function that expects a date string and must return a Date object.
     */
    flatpickrParseDate = input<Function | undefined>(undefined, { alias: 'parseDate' });

    /**
     * HTML for the left arrow icon.
     */
    flatpickrPrevArrow = input<string | undefined>(undefined, { alias: 'prevArrow' });

    /**
     * Show the month using the shorthand version (ie, Sep instead of September).
     */
    flatpickrShorthandCurrentMonth = input<boolean | undefined>(undefined, { alias: 'shorthandCurrentMonth' });

    /**
     * Position the calendar inside the wrapper and next to the input element.
     */
    flatpickrStatic = input<boolean | undefined>(undefined, { alias: 'static' });

    /**
     * Displays time picker in 24 hour mode without AM/PM selection when enabled.
     */
    flatpickrTime_24hr = input<boolean | undefined>(undefined, { alias: 'time_24hr' });

    flatpickrUtc = input<boolean | undefined>(undefined, { alias: 'utc' });

    /**
     * Enables display of week numbers in calendar.
     */
    flatpickrWeekNumbers = input<boolean | undefined>(undefined, { alias: 'weekNumbers' });

    /**
     * Custom elements and input groups.
     */
    flatpickrWrap = input<boolean | undefined>(undefined, { alias: 'wrap' });

    /**
     * onChange gets triggered when the user selects a date, or changes the time on a selected date.
     */
    flatpickrOnChange = output<FlatpickrEvent>({ alias: 'onChange' });

    /**
     * onClose gets triggered when the calendar is closed.
     */
    flatpickrOnClose = output<FlatpickrEvent>({ alias: 'onClose' });

    /**
     * onOpen gets triggered when the calendar is opened.
     */
    flatpickrOnOpen = output<FlatpickrEvent>({ alias: 'onOpen' });

    /**
     * onReady gets triggered once the calendar is in a ready state.
     */
    flatpickrOnReady = output<FlatpickrEvent>({ alias: 'onReady' });

    protected globalOnChange?: Hook | Hook[];
    protected globalOnClose?: Hook | Hook[];
    protected globalOnOpen?: Hook | Hook[];
    protected globalOnReady?: Hook | Hook[];
    protected flatpickr!: FlatpickrInstance;
    protected resolvedOptions: FlatpickrOptions = {};
    protected formControlListener?: Subscription;
    protected isInitialized = signal(false);

    protected parent = inject(ControlContainer, { optional: true });
    protected ngControl = inject(NgControl, { optional: true, self: true });
    protected element = inject(ElementRef);
    protected renderer = inject(Renderer2);

    constructor() {
        effect(() => {
            if (!this.isInitialized()) return;
            const options = this.flatpickrOptions();
            for (const optionName in options) {
                if (options.hasOwnProperty(optionName)) {
                    this.flatpickr.set(optionName as any, (options as any)[optionName]);
                }
            }
        });

        effect(() => {
            if (!this.isInitialized()) return;

            const optionMap: { [key: string]: any } = {
                altFormat: this.flatpickrAltFormat(),
                altInput: this.flatpickrAltInput(),
                altInputClass: this.flatpickrAltInputClass(),
                allowInput: this.flatpickrAllowInput(),
                appendTo: this.flatpickrAppendTo(),
                clickOpens: this.flatpickrClickOpens(),
                dateFormat: this.flatpickrDateFormat(),
                defaultDate: this.flatpickrDefaultDate(),
                disable: this.flatpickrDisable(),
                disableMobile: this.flatpickrDisableMobile(),
                enable: this.flatpickrEnable(),
                enableTime: this.flatpickrEnableTime(),
                enableSeconds: this.flatpickrEnableSeconds(),
                hourIncrement: this.flatpickrHourIncrement(),
                inline: this.flatpickrInline(),
                locale: this.flatpickrLocale(),
                maxDate: this.flatpickrMaxDate(),
                minDate: this.flatpickrMinDate(),
                minuteIncrement: this.flatpickrMinuteIncrement(),
                mode: this.flatpickrMode(),
                nextArrow: this.flatpickrNextArrow(),
                noCalendar: this.flatpickrNoCalendar(),
                parseDate: this.flatpickrParseDate(),
                prevArrow: this.flatpickrPrevArrow(),
                shorthandCurrentMonth: this.flatpickrShorthandCurrentMonth(),
                static: this.flatpickrStatic(),
                time_24hr: this.flatpickrTime_24hr(),
                utc: this.flatpickrUtc(),
                weekNumbers: this.flatpickrWeekNumbers(),
                wrap: this.flatpickrWrap()
            };

            for (const optionName in optionMap) {
                const val = optionMap[optionName];
                if (val !== undefined) {
                    this.flatpickr.set(optionName as any, val);
                }
            }

            const altInputVal = this.flatpickrAltInput();
            const placeholderVal = this.placeholder();
            if (altInputVal && placeholderVal && this.flatpickr.altInput) {
                this.flatpickr.altInput.setAttribute('placeholder', placeholderVal);
            }
        });
    }

    /** Allow access properties using index notation */
    [key: string]: any;

    get control(): FormControl | null {
        if (!this.ngControl) {
            return null;
        }
        return (this.ngControl.control || (this.parent && (this.parent as any).formDirective?.getControl(this.ngControl))) as FormControl;
    }

    /** Allow double-clicking on the control to open/close it. */
    public onClick() {
        if (this.flatpickr) {
            this.flatpickr.toggle();
        }
    }

    ngAfterViewInit() {
        /** We cannot initialize the flatpickr instance in ngOnInit(); it will
         randomize the date when the form control initializes. */
        let nativeElement = this.element.nativeElement;

        if (typeof nativeElement === 'undefined' || nativeElement === null) {
            throw 'Error: invalid input element specified';
        }

        if (this.resolvedOptions.wrap) {
            this.renderer.setAttribute(this.element.nativeElement, 'data-input', '');
            nativeElement = nativeElement.parentNode;
        }

        this.flatpickr = <FlatpickrInstance>flatpickr(nativeElement, this.resolvedOptions);

        this.isInitialized.set(true);

        this.setupControlSubscription();
    }

    protected setupControlSubscription() {
        const control = this.control;
        if (control) {
            // Apply initial control value to flatpickr if present
            if (control.value !== undefined && control.value !== null && control.value !== '') {
                this.flatpickr.setDate(control.value, false);
            }

            this.formControlListener = control.valueChanges
                .subscribe((value: any) => {
                    if (this.flatpickr) {
                        if (value === undefined || value === null || value === '') {
                            if (this.flatpickr.selectedDates.length > 0) {
                                this.flatpickr.clear();
                            }
                        } else {
                            const currentDate = this.flatpickr.selectedDates[0];
                            const newDate = value instanceof Date ? value : new Date('' + value);
                            if (!isNaN(newDate.getTime())) {
                                if (!currentDate || currentDate.getTime() !== newDate.getTime()) {
                                    this.flatpickr.setDate(newDate, false);
                                }
                            }
                        }
                    }

                    if (value && !(value instanceof Date)) {
                        // Quietly update the value of the form control to be a
                        // Date object. This avoids any external subscribers
                        // from being notified a second time.
                        control.setValue(new Date('' + value), {
                            onlySelf: true,
                            emitEvent: false,
                            emitModelToViewChange: false,
                            emitViewToModelChange: false
                        });
                    }
                });
        }
    }

    ngOnDestroy() {
        if (this.flatpickr) {
            this.flatpickr.destroy();
        }

        if (this.formControlListener) {
            this.formControlListener.unsubscribe();
        }
    }

    ngOnInit() {
        const optionsVal = this.flatpickrOptions() || {};

        this.globalOnChange = optionsVal.onChange;
        this.globalOnClose = optionsVal.onClose;
        this.globalOnOpen = optionsVal.onOpen;
        this.globalOnReady = optionsVal.onReady;

        this.resolvedOptions = {
            altFormat: this.getOption('altFormat'),
            altInput: this.getOption('altInput'),
            altInputClass: this.getOption('altInputClass'),
            allowInput: this.getOption('allowInput'),
            appendTo: this.getOption('appendTo'),
            clickOpens: this.getOption('clickOpens', true),
            dateFormat: this.getOption('dateFormat'),
            defaultDate: this.getOption('defaultDate'),
            disable: this.getOption('disable'),
            disableMobile: this.getOption('disableMobile'),
            enable: this.getOption('enable'),
            enableTime: this.getOption('enableTime'),
            enableSeconds: this.getOption('enableSeconds'),
            hourIncrement: this.getOption('hourIncrement'),
            inline: this.getOption('inline'),
            locale: this.getOption('locale'),
            maxDate: this.getOption('maxDate'),
            minDate: this.getOption('minDate'),
            minuteIncrement: this.getOption('minuteIncrement'),
            mode: this.getOption('mode'),
            nextArrow: this.getOption('nextArrow'),
            noCalendar: this.getOption('noCalendar'),
            onChange: this.eventOnChange.bind(this),
            onClose: this.eventOnClose.bind(this),
            onOpen: this.eventOnOpen.bind(this),
            onReady: this.eventOnReady.bind(this),
            parseDate: this.getOption('parseDate'),
            prevArrow: this.getOption('prevArrow'),
            shorthandCurrentMonth: this.getOption('shorthandCurrentMonth'),
            static: this.getOption('static'),
            time_24hr: this.getOption('time_24hr'),
            utc: this.getOption('utc'),
            weekNumbers: this.getOption('weekNumbers'),
            wrap: this.getOption('wrap', true),
        };

        // Remove unset properties
        Object.keys(this.resolvedOptions).forEach((key: string) => {
            ((this.resolvedOptions as any)[key] === undefined) &&
            delete (this.resolvedOptions as any)[key];
        });
    }

    /**
     * Fire off the event emitter for the directive element, and also for the
     * global onChange callback, if defined.
     */
    protected eventOnChange(selectedDates: Date[], dateStr: string, instance: Object): void {
        let event: FlatpickrEvent = {
            selectedDates: selectedDates,
            dateStr: dateStr,
            instance: instance
        };

        if (this.control) {
            let value: any = null;
            if (selectedDates && selectedDates.length > 0) {
                if (this.resolvedOptions.mode === 'multiple' || this.resolvedOptions.mode === 'range') {
                    value = selectedDates;
                } else {
                    value = selectedDates[0];
                }
            }
            if (this.control.value !== value) {
                this.control.setValue(value, {
                    emitModelToViewChange: false
                });
            }
        }

        // Trigger native change and input events
        if (this.element && this.element.nativeElement) {
            this.renderer.setProperty(this.element.nativeElement, 'value', dateStr);
            this.element.nativeElement.dispatchEvent(new Event('input', { bubbles: true }));
            this.element.nativeElement.dispatchEvent(new Event('change', { bubbles: true }));
        }

        if (this.flatpickrOnChange) {
            this.flatpickrOnChange.emit(event);
        }
        this.executeGlobalHook(this.globalOnChange, event);
    }

    /**
     * Fire off the event emitter for the directive element, and also for the
     * global onClose callback, if defined.
     */
    protected eventOnClose(selectedDates: Date[], dateStr: string, instance: Object): void {
        let event: FlatpickrEvent = {
            selectedDates: selectedDates,
            dateStr: dateStr,
            instance: instance
        };
        if (this.flatpickrOnClose) {
            this.flatpickrOnClose.emit(event);
        }
        this.executeGlobalHook(this.globalOnClose, event);
    }

    /**
     * Fire off the event emitter for the directive element, and also for the
     * global onOpen callback, if defined.
     */
    protected eventOnOpen(selectedDates: Date[], dateStr: string, instance: Object): void {
        let event: FlatpickrEvent = {
            selectedDates: selectedDates,
            dateStr: dateStr,
            instance: instance
        };
        if (this.flatpickrOnOpen) {
            this.flatpickrOnOpen.emit(event);
        }
        this.executeGlobalHook(this.globalOnOpen, event);
    }

    /**
     * Fire off the event emitter for the directive element, and also for the
     * global onReady callback, if defined.
     */
    protected eventOnReady(selectedDates: Date[], dateStr: string, instance: Object): void {
        let event: FlatpickrEvent = {
            selectedDates: selectedDates,
            dateStr: dateStr,
            instance: instance
        };
        if (this.flatpickrOnReady) {
            this.flatpickrOnReady.emit(event);
        }
        this.executeGlobalHook(this.globalOnReady, event);
    }

    protected executeGlobalHook(hook: Hook | Hook[] | undefined, event: FlatpickrEvent) {
        if (!hook) {
            return;
        }
        if (Array.isArray(hook)) {
            hook.forEach(fn => (fn as any)(event));
        } else {
            (hook as any)(event);
        }
    }

    /**
     * Return the configuration value for option {option}, or {defaultValue} if it
     * doesn't exist.
     */
    protected getOption(option: string, defaultValue?: any): any {
        let localName = 'flatpickr' + option.substring(0, 1).toUpperCase()
            + option.substring(1);

        const signalProp = this[localName];
        if (signalProp && typeof signalProp === 'function') {
            const val = signalProp();
            if (val !== undefined) {
                return val;
            }
        }

        const optionsVal = this.flatpickrOptions();
        if (optionsVal && typeof (optionsVal as any)[option] !== 'undefined') {
            return (optionsVal as any)[option];
        }

        return defaultValue;
    }
}