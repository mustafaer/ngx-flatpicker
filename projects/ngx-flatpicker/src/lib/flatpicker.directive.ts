import {
    AfterViewInit, Directive, ElementRef, EventEmitter, HostListener, Input,
    OnDestroy, OnInit, Output, Renderer2, SimpleChanges, OnChanges, Optional, Self
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
    standalone: true
})
export class NgxFlatpickrDirective implements AfterViewInit, OnDestroy, OnInit, OnChanges {
    /**
     * The flatpickr configuration as a single object of values.
     *
     * See https://chmln.github.io/flatpickr/options/ for full list.
     */
    @Input('flatpickr') public flatpickrOptions!: FlatpickrOptions;

    /**
     * Placeholder for input field.
     *
     * Default:  null
     */
    @Input('placeholder') public placeholder!: string;

    /**
     * Exactly the same as date format, but for the altInput field.
     *
     * Default:  "F j, Y"
     */
    @Input('altFormat') public flatpickrAltFormat!: string;

    /**
     * Show the user a readable date (as per altFormat), but return something
     * totally different to the server.
     *
     * Default:  false
     */
    @Input('altInput') public flatpickrAltInput!: boolean;

    /**
     * This class will be added to the input element created by the altInput
     * option.
     *
     * Default:  ""
     */
    @Input('altInputClass') public flatpickrAltInputClass!: string;

    /**
     * Allows the user to enter a date directly input the input field. By
     * default, direct entry is disabled.
     *
     * Default:  false
     */
    @Input('allowInput') public flatpickrAllowInput!: boolean;

    /**
     * Instead of body, appends the calendar to the specified node instead.
     *
     * Default:  null
     */
    @Input('appendTo') public flatpickrAppendTo: any; // HTMLElement

    /**
     * Whether clicking on the input should open the picker.
     * You could disable this if you wish to open the calendar manually
     * with.open().
     *
     * Default:  true
     */
    @Input('clickOpens') public flatpickrClickOpens!: boolean;

    /**
     * A string of characters which are used to define how the date will be
     * displayed in the input box.
     * See https://chmln.github.io/flatpickr/formatting/ for supported tokens.
     *
     * Default:  "Y-m-d"
     */
    @Input('dateFormat') public flatpickrDateFormat!: string;

    /**
     * Sets the initial selected date(s).
     *
     * If you're using {mode: "multiple"} or a range calendar supply an Array of
     * Date objects or an Array of date strings which follow your dateFormat.
     *
     * Otherwise, you can supply a single Date object or a date string.
     *
     * Default:  null
     */
    @Input('defaultDate') public flatpickrDefaultDate!: string | Date;

    /**
     * Disable an array of specific dates, date ranges, or functions to disable
     * dates. See https://chmln.github.io/flatpickr/examples/#disabling-specific-dates
     *
     * Default:  []
     */
    @Input('disable') public flatpickrDisable!: string[] | Date[];

    /**
     * Set disableMobile to true to always use the non-native picker. By
     * default, Flatpickr utilizes native datetime widgets unless certain
     * options (e.g. disable) are used.
     *
     * Default:  false
     */
    @Input('disableMobile') public flatpickrDisableMobile!: boolean;

    /**
     * Enable an array of specific dates, date ranges, or functions to enable
     * dates. See https://chmln.github.io/flatpickr/examples/#disabling-all-dates-except-select-few
     *
     * Default:  []
     */
    @Input('enable') public flatpickrEnable!: string[] | Date[];

    /**
     * Enables time picker.
     *
     * Default:  false
     */
    @Input('enableTime') public flatpickrEnableTime!: boolean;

    /**
     * Enables seconds in the time picker.
     *
     * Default:  false
     */
    @Input('enableSeconds') public flatpickrEnableSeconds!: boolean;

    /**
     * Adjusts the step for the hour input (incl. scrolling).
     *
     * Default:  1
     */
    @Input('hourIncrement') public flatpickrHourIncrement!: number;

    /**
     * Displays the calendar inline.
     *
     * Default:  false
     */
    @Input('inline') public flatpickrInline!: boolean;

    /**
     * Use a specific locale for the flatpickr instance.
     *
     * Default:  null
     */
    @Input('locale') public flatpickrLocale!: Object;

    /**
     * The maximum date that a user can pick to (inclusive).
     *
     * Default:  null
     */
    @Input('maxDate') public flatpickrMaxDate!: string | Date;

    /**
     * The minimum date that a user can start picking from (inclusive).
     *
     * Default:  null
     */
    @Input('minDate') public flatpickrMinDate!: string | Date;

    /**
     * Adjusts the step for the minute input (incl. scrolling).
     *
     * Default:  5
     */
    @Input('minuteIncrement') public flatpickrMinuteIncrement!: number;

    /**
     * "single", "multiple", or "range"
     *
     * Default:  "single"
     */
    @Input('mode') public flatpickrMode!: string;

    /**
     * HTML for the arrow icon, used to switch months.
     *
     * Default:  ">"
     */
    @Input('nextArrow') public flatpickrNextArrow!: string;

    /**
     * Hides the day selection in calendar. Use it along with enableTime to
     * create a time picker.
     *
     * Default:  false
     */
    @Input('noCalendar') public flatpickrNoCalendar!: boolean;

    /**
     * Function that expects a date string and must return a Date object.
     *
     * Default:  false
     */
    @Input('parseDate') public flatpickrParseDate!: Function;

    /**
     * HTML for the left arrow icon.
     *
     * Default:  "<"
     */
    @Input('prevArrow') public flatpickrPrevArrow!: string;

    /**
     * Show the month using the shorthand version (ie, Sep instead of September).
     *
     * Default:  false
     */
    @Input('shorthandCurrentMonth') public flatpickrShorthandCurrentMonth!: boolean;

    /**
     * Position the calendar inside the wrapper and next to the input element
     * (Leave false unless you know what you're doing).
     *
     * Default:  false
     */
    @Input('static') public flatpickrStatic!: boolean;

    /**
     * Displays time picker in 24 hour mode without AM/PM selection when enabled.
     *
     * Default:  false
     */
    @Input('time_24hr') public flatpickrTime_24hr!: boolean;

    @Input('utc') public flatpickrUtc!: boolean;

    /**
     * Enables display of week numbers in calendar.
     *
     * Default:  false
     */
    @Input('weekNumbers') public flatpickrWeekNumbers!: boolean;

    /**
     * Custom elements and input groups.
     *
     * Default:  false
     */
    @Input('wrap') public flatpickrWrap!: boolean;

    /**
     * onChange gets triggered when the user selects a date, or changes the time on a selected date.
     *
     * Default:  null
     */
    @Output('onChange') public flatpickrOnChange: EventEmitter<FlatpickrEvent> = new EventEmitter();

    /**
     * onClose gets triggered when the calendar is closed.
     *
     * Default:  null
     */
    @Output('onClose') public flatpickrOnClose: EventEmitter<FlatpickrEvent> = new EventEmitter();

    /**
     * onOpen gets triggered when the calendar is opened.
     *
     * Default:  null
     */
    @Output('onOpen') public flatpickrOnOpen: EventEmitter<FlatpickrEvent> = new EventEmitter();

    /**
     * onReady gets triggered once the calendar is in a ready state.
     *
     * Default:  null
     */
    @Output('onReady') public flatpickrOnReady: EventEmitter<FlatpickrEvent> = new EventEmitter();
    protected globalOnChange?: Hook | Hook[];
    protected globalOnClose?: Hook | Hook[];
    protected globalOnOpen?: Hook | Hook[];
    protected globalOnReady?: Hook | Hook[];
    protected flatpickr!: FlatpickrInstance;
    protected formControlListener?: Subscription;

    constructor(
        @Optional() protected parent: ControlContainer,
        @Optional() @Self() protected ngControl: NgControl,
        protected element: ElementRef,
        protected renderer: Renderer2
    ) {
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
    @HostListener('dblclick')
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

        if (this.flatpickrOptions.wrap) {
            this.renderer.setAttribute(this.element.nativeElement, 'data-input', '');
            nativeElement = nativeElement.parentNode;
        }

        this.flatpickr = <FlatpickrInstance>flatpickr(nativeElement, this.flatpickrOptions);

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

    ngOnChanges(changes: SimpleChanges) {
        if (!this.flatpickr) {
            return;
        }

        if (this.flatpickrAltInput
            && changes.hasOwnProperty('placeholder')
            && changes['placeholder'].currentValue) {
            if (this.flatpickr.altInput) {
                this.flatpickr.altInput.setAttribute('placeholder', changes['placeholder'].currentValue);
            }
        }

        // Handle updates to the entire flatpickrOptions config object
        if (changes.hasOwnProperty('flatpickrOptions') && changes['flatpickrOptions'].currentValue) {
            const newOptions = changes['flatpickrOptions'].currentValue;
            for (const optionName in newOptions) {
                if (newOptions.hasOwnProperty(optionName)) {
                    this.flatpickr.set(optionName as any, newOptions[optionName]);
                }
            }
        }

        // Map inputs to option names
        const optionMap: { [key: string]: string } = {
            flatpickrAltFormat: 'altFormat',
            flatpickrAltInput: 'altInput',
            flatpickrAltInputClass: 'altInputClass',
            flatpickrAllowInput: 'allowInput',
            flatpickrAppendTo: 'appendTo',
            flatpickrClickOpens: 'clickOpens',
            flatpickrDateFormat: 'dateFormat',
            flatpickrDefaultDate: 'defaultDate',
            flatpickrDisable: 'disable',
            flatpickrDisableMobile: 'disableMobile',
            flatpickrEnable: 'enable',
            flatpickrEnableTime: 'enableTime',
            flatpickrEnableSeconds: 'enableSeconds',
            flatpickrHourIncrement: 'hourIncrement',
            flatpickrInline: 'inline',
            flatpickrLocale: 'locale',
            flatpickrMaxDate: 'maxDate',
            flatpickrMinDate: 'minDate',
            flatpickrMinuteIncrement: 'minuteIncrement',
            flatpickrMode: 'mode',
            flatpickrNextArrow: 'nextArrow',
            flatpickrNoCalendar: 'noCalendar',
            flatpickrParseDate: 'parseDate',
            flatpickrPrevArrow: 'prevArrow',
            flatpickrShorthandCurrentMonth: 'shorthandCurrentMonth',
            flatpickrStatic: 'static',
            flatpickrTime_24hr: 'time_24hr',
            flatpickrUtc: 'utc',
            flatpickrWeekNumbers: 'weekNumbers',
            flatpickrWrap: 'wrap'
        };

        for (const changeKey in changes) {
            if (changes.hasOwnProperty(changeKey) && optionMap[changeKey]) {
                const optionName = optionMap[changeKey];
                const currentValue = changes[changeKey].currentValue;
                this.flatpickr.set(optionName as any, currentValue);
            }
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
        if (!this.flatpickrOptions) {
            this.flatpickrOptions = {};
        }

        this.globalOnChange = this.flatpickrOptions.onChange;
        this.globalOnClose = this.flatpickrOptions.onClose;
        this.globalOnOpen = this.flatpickrOptions.onOpen;
        this.globalOnReady = this.flatpickrOptions.onReady;

        this.flatpickrOptions = {
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
        Object.keys(this.flatpickrOptions).forEach((key: string) => {
            ((this.flatpickrOptions as any)[key] === undefined) &&
            delete (this.flatpickrOptions as any)[key];
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
                if (this.flatpickrOptions.mode === 'multiple' || this.flatpickrOptions.mode === 'range') {
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

        if (typeof this[localName] !== 'undefined') {
            return this[localName];
        } else if (this.flatpickrOptions && typeof (this.flatpickrOptions as any)[option] !== 'undefined') {
            return (this.flatpickrOptions as any)[option];
        } else {
            return defaultValue;
        }
    }
}