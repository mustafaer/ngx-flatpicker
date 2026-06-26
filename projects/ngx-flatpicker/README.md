# ngx-flatpicker

[![npm version](https://img.shields.io/npm/v/ngx-flatpicker.svg)](https://www.npmjs.com/package/ngx-flatpicker)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![Angular Compatibility](https://img.shields.io/badge/Angular-18%20%7C%2019%20%7C%2020-red.svg)](#compatibility)
[![Build Status](https://img.shields.io/badge/build-passing-brightgreen.svg)](#)

A modern, lightweight, and highly performant **Flatpickr wrapper for Angular 18/19+**. It provides both a standalone attribute directive and a standalone wrapper component with native **Reactive Forms (`ControlValueAccessor`)** support, dynamic configuration updates, and full mobile-responsive fallbacks.

---

## 🌟 Features

- **Angular 18 & 19+ Ready**: Full support for Ivy compilation and standalone components/directives.
- **Reactive Forms & ngModel**: Seamless integration with Angular's Forms API (`formControlName`, `formControl`, `ngModel`).
- **Flexible UI Integration**:
  - **Attribute Directive (`[flatpickr]`)**: Initialize flatpickr directly on standard `<input>` elements for minimal DOM weight and custom layout freedom.
  - **Component Wrapper (`<ngx-flatpickr>`)**: Quick datepicker wrapper container.
- **Dynamic Configuration**: Change datepicker bounds (`minDate`, `maxDate`), locale, or theme configuration on-the-fly via inputs.
- **Alt-Input Pattern**: User-friendly display formats (e.g. `Thursday, Oct 26`) combined with ISO standard model formats (e.g. `2026-10-26`).
- **No Global Leakage**: Native typescript typings map directly to Flatpickr's official typings (`Options`, `Instance`) with zero compiler bypasses.

---

## 📅 Compatibility

| ngx-flatpicker | Angular Version | Flatpickr Version |
| :------------- | :-------------- | :---------------- |
| **`v19.x.x`**  | `>= 18.0.0`     | `^4.6.13`         |

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

Since version 18, `ngx-flatpicker` components and directives are **standalone** and can be imported directly where needed.

### 1. Standalone Attribute Directive Usage (Recommended)
Bind flatpickr directly to a native input inside a form.

```typescript
import { Component } from '@angular/core';
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
        [flatpickr]="pickerOptions" 
        formControlName="bookingDate"
      />
    </form>
  `
})
export class BookingComponent {
  form = new FormGroup({
    bookingDate: new FormControl(new Date())
  });

  pickerOptions: FlatpickrOptions = {
    enableTime: true,
    dateFormat: 'Y-m-d H:i',
    minDate: 'today'
  };
}
```

### 2. Standalone Component Wrapper Usage
Use `<ngx-flatpickr>` to instantiate a date picker with automated layout wrapping.

```typescript
import { Component } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NgxFlatpickrComponent, FlatpickrOptions } from 'ngx-flatpicker';

@Component({
  selector: 'app-event',
  standalone: true,
  imports: [ReactiveFormsModule, NgxFlatpickrComponent],
  template: `
    <form [formGroup]="form">
      <ngx-flatpickr 
        [config]="pickerOptions"
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

  pickerOptions: FlatpickrOptions = {
    dateFormat: 'Y-m-d',
    wrap: true
  };
}
```

### 3. Backward Compatibility (NgModule)
If you are still using module-based orchestration, import `NgxFlatpickrModule` in your `@NgModule`:

```typescript
import { NgModule } from '@angular/core';
import { NgxFlatpickrModule } from 'ngx-flatpicker';

@NgModule({
  imports: [
    NgxFlatpickrModule
    // ...
  ]
})
export class AppModule {}
```

---

## ⚙️ Configuration & API Reference

### `NgxFlatpickrDirective` API

#### Inputs

| Input Name | Type | Default | Description |
| :--- | :--- | :--- | :--- |
| `[flatpickr]` | `FlatpickrOptions` | `undefined` | Combined Flatpickr configuration options. |
| `[placeholder]` | `string` | `undefined` | Input field placeholder text. |
| `[altFormat]` | `string` | `"F j, Y"` | User-facing display date format. |
| `[altInput]` | `boolean` | `false` | Enable user-friendly display input wrapper. |
| `[altInputClass]` | `string` | `""` | CSS classes to append to the alt input. |
| `[allowInput]` | `boolean` | `false` | Allow manual keyboard typing in the input. |
| `[clickOpens]` | `boolean` | `true` | Open the calendar calendar on input focus/click. |
| `[dateFormat]` | `string` | `"Y-m-d"` | Saved value model format. |
| `[minDate]` | `string \| Date` | `undefined` | Minimum date limit allowed for selection. |
| `[maxDate]` | `string \| Date` | `undefined` | Maximum date limit allowed for selection. |
| `[enableTime]` | `boolean` | `false` | Enable time picker. |
| `[enableSeconds]` | `boolean` | `false` | Enable seconds in the time picker. |
| `[hourIncrement]` | `number` | `1` | Increment value for hours input. |
| `[minuteIncrement]` | `number` | `5` | Increment value for minutes input. |
| `[mode]` | `"single" \| "multiple" \| "range"` | `"single"` | Date selection mode. |

#### Outputs

| Output Name | Event Type | Description |
| :--- | :--- | :--- |
| `(onChange)` | `EventEmitter<FlatpickrEvent>` | Emits when a date/time is selected. |
| `(onClose)` | `EventEmitter<FlatpickrEvent>` | Emits when the calendar dropdown closes. |
| `(onOpen)` | `EventEmitter<FlatpickrEvent>` | Emits when the calendar dropdown opens. |
| `(onReady)` | `EventEmitter<FlatpickrEvent>` | Emits once the calendar finishes initialization. |

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
