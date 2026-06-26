import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import 'flatpickr';
import {NgxFlatpickrComponent} from "./ngx-flatpicker.component";
import {NgxFlatpickrDirective} from "./flatpicker.directive";

@NgModule({
    imports: [
        CommonModule,
        NgxFlatpickrComponent,
        NgxFlatpickrDirective
    ],
    exports: [
        NgxFlatpickrComponent,
        NgxFlatpickrDirective
    ]
})
export class NgxFlatpickrModule {
}