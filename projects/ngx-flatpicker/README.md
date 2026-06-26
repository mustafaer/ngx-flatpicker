# ngx-flatpicker

[![npm version](https://img.shields.io/npm/v/ngx-flatpicker.svg)](https://www.npmjs.com/package/ngx-flatpicker)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Angular Compatibility](https://img.shields.io/badge/Angular-22+-red.svg)](#compatibility)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](#)

A premium, high-performance **Flatpickr date-time picker integration for Angular 22+**. Re-engineered from the ground up to utilize **100% native Angular 22 features**, including **Signal Inputs (`input()`)**, **Signal Outputs (`output()`)**, and the **`inject()` dependency injection model**, while maintaining complete compatibility with **Angular Reactive Forms (`ControlValueAccessor`)**.

---

## 🌟 Features

- **Angular 22+ Signal Architecture**: Completely built on Signal-based reactive data flows for optimal change detection performance.
- **Reactive Forms & `ngModel` Integration**: Seamless CVA binding for robust form control synchronization.
- **Dynamic Configuration Updates**: Modify pickers on-the-fly via reactive inputs.
- **Dual-UI Paradigms**:
  - **Attribute Directive (`[flatpickr]`)**: Initialize flatpickr directly on standard `<input>` elements for minimal DOM weight and custom layout freedom.
  - **Component Wrapper (`<ngx-flatpickr>`)**: Quick datepicker wrapper container.
- **Alt-Input Pattern**: User-friendly display formats (e.g. `Thursday, Oct 26`) combined with ISO standard model formats (e.g. `2026-10-26`).
- **No Global Leakage**: Direct TypeScript mapping to Flatpickr's official typings (`Options`, `Instance`) with zero compiler bypasses.

---

## 📅 Compatibility

| ngx-flatpicker | Angular Version | Flatpickr Version | TypeScript Version |
| :------------- | :-------------- | :---------------- | :----------------- |
| **`v22.x.x`**  | `>= 22.0.0`     | `^4.6.13`         | `>= 5.9.0`         |

---

## 🚀 Installation

Install the library along with its peer dependency, `flatpickr`:

```bash
npm install ngx-flatpicker flatpickr
```

### 1. Add Flatpickr Styles
Include the flatpickr stylesheet in your `angular.json` styles array:

```json
"styles": [
  "node_modules/flatpickr/dist/flatpickr.css",
  "src/styles.css"
]
```

Or import it directly in your main `styles.css` / `styles.scss` file:

```css
@import "flatpickr/dist/flatpickr.css";
```

---

## 🛠️ Setup & Usage

### 1. Standalone Attribute Directive Usage (Recommended)
Bind flatpickr directly to a native input inside a form.

```typescript
import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgxFlatpickrDirective, FlatpickrOptions } from 'ngx-flatpicker';

@Component({
  selector: 'app-booking',
  standalone: true,
  imports: [ReactiveFormsModule, NgxFlatpickrDirective],
  template: `
    <form [formGroup]="form">
      <label for="check-in">Check-in Date:</label>
      <input 
        id="check-in"
        type="text" 
        flatpickr 
        [flatpickr]="pickerOptions()" 
        formControlName="bookingDate"
      />
    </form>
  `
})
export class BookingComponent {
  form = new FormGroup({
    bookingDate: new FormControl(new Date())
  });

  pickerOptions = signal<FlatpickrOptions>({
    enableTime: true,
    dateFormat: 'Y-m-d H:i',
    minDate: 'today'
  });
}
```

### 2. Standalone Component Wrapper Usage
Use `<ngx-flatpickr>` to instantiate a date picker with automated layout wrapping.

```typescript
import { Component, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgxFlatpickrComponent, FlatpickrOptions } from 'ngx-flatpicker';

@Component({
  selector: 'app-event',
  standalone: true,
  imports: [ReactiveFormsModule, NgxFlatpickrComponent],
  template: `
    <form [formGroup]="form">
      <ngx-flatpickr 
        [config]="pickerOptions()"
        formControlName="eventDate"
        placeholder="Select event date"
      ></ngx-flatpickr>
    </form>
  `
})
export class EventComponent {
  form = new FormGroup({
    eventDate: new FormControl(null)
  });

  pickerOptions = signal<FlatpickrOptions>({
    dateFormat: 'Y-m-d',
    wrap: true
  });
}
```

---

## ⚙️ Configuration & API Reference

### `NgxFlatpickrDirective` API

#### Signal Inputs

| Input Name | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `[flatpickr]` | `FlatpickrOptions` | `{}` | Combined Flatpickr configuration options. |
| `[placeholder]` | `string` | `undefined` | Input field placeholder text. |
| `[altFormat]` | `string` | `undefined` | User-facing display date format. |
| `[altInput]` | `boolean` | `undefined` | Enable user-friendly display input wrapper. |
| `[altInputClass]` | `string` | `undefined` | CSS classes to append to the alt input. |
| `[allowInput]` | `boolean` | `undefined` | Allow manual keyboard typing in the input. |
| `[clickOpens]` | `boolean` | `undefined` | Open the calendar calendar on input focus/click. |
| `[dateFormat]` | `string` | `undefined` | Saved value model format. |
| `[minDate]` | `string \| Date` | `undefined` | Minimum date limit allowed for selection. |
| `[maxDate]` | `string \| Date` | `undefined` | Maximum date limit allowed for selection. |
| `[enableTime]` | `boolean` | `undefined` | Enable time picker. |
| `[enableSeconds]` | `boolean` | `undefined` | Enable seconds in the time picker. |
| `[hourIncrement]` | `number` | `undefined` | Increment value for hours input. |
| `[minuteIncrement]` | `number` | `undefined` | Increment value for minutes input. |
| `[mode]` | `"single" \| "multiple" \| "range"` | `undefined` | Date selection mode. |

#### Signal Outputs

| Output Name | Event Type | Description |
| :--- | :--- | :--- |
| `(onChange)` | `FlatpickrEvent` | Emits when a date/time is selected. |
| `(onClose)` | `FlatpickrEvent` | Emits when the calendar dropdown closes. |
| `(onOpen)` | `FlatpickrEvent` | Emits when the calendar dropdown opens. |
| `(onReady)` | `FlatpickrEvent` | Emits once the calendar finishes initialization. |

---

## 📝 Interfaces & Typings

#### `FlatpickrEvent`
```typescript
export interface FlatpickrEvent {
  selectedDates: Date[];
  dateStr: string;
  instance: any;
}
```

#### `FlatpickrOptions`
Maps directly to flatpickr's own config types, fully extended for custom fields:
```typescript
import { Options } from 'flatpickr/dist/types/options';
export type FlatpickrOptions = Options & { utc?: boolean };
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to open issues or submit pull requests to help improve `ngx-flatpicker`.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
