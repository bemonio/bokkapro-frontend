import { Component, forwardRef, Renderer2, ViewChild, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { ContentTypeService as ModelsService } from '../../_services/content-type.service';
import { LazyLoadEvent } from 'primeng/api';
import { ToastService } from 'src/app/modules/toast/_services/toast.service';
import { AuthService } from 'src/app/modules/auth';
export const EPANDED_TEXTAREA_VALUE_ACCESSOR: any = {
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => ContentTypeSelectComponent),
    multi: true,
};

@Component({
    selector: 'app-content-type-select',
    templateUrl: './content-type-select.component.html',
    styleUrls: ['./content-type-select.component.scss'],
    providers: [EPANDED_TEXTAREA_VALUE_ACCESSOR],
})
export class ContentTypeSelectComponent implements ControlValueAccessor, OnInit {
    @Input() model: any;
    @Input() valid: boolean;
    @Input() touched: boolean;
    @Input() required: boolean;
    @Input() disabled: boolean;
    @Input() placeholder: string;
    @Input() addFilters: { key: string, value: string }[];

    public models: any[];

    public onChange;
    public onTouched;

    public totalRecords: number;
    public page: number;
    public per_page: number;
    public sort: string;
    public query: string;
    public filters: { key: string, value: string }[];
    public _with: { key: string, value: string }[];

    public value: any;

    constructor(
        public modelsService: ModelsService,
        public toastService: ToastService
    ) {
        this.page = 1;
        this.per_page = 100;
    }

    public ngOnInit() {
        if (!this.placeholder) {
            this.placeholder = 'Content Type';
        }
        this.load();
    }

    writeValue(value: any) {
        // const div = this.textarea.nativeElement;
        // this.renderer.setProperty(div, 'textContent', value);
        this.value = value;
    }

    registerOnChange(fn: any) {
        this.onChange = fn;
    }

    registerOnTouched(fn: any) {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean) {
        this.disabled = isDisabled;
    }

    public change($event) {
        this.onChange(this.value);
        this.onTouched(this.value);
    }

    public load() {
        this.filters = [];
        if (this.addFilters) {
            this.addFilters.forEach(element => {
                this.filters.push({ key: 'filter{' + element.key + '}', value: element.value })
            });
        }
        this.getModels();
    }

    getModels() {
        this.modelsService.get(this.page, this.per_page, this.sort, this.query, this.filters, this._with).subscribe(
            response => {
                this.models = response.content_types;
                this.totalRecords = response.meta.total_results;
                // if (this.model) {
                //     if (this.model.id) {
                //         this.model.id = undefined;
                //         this.value = this.models[0];
                //         this.filters = [];
                //     }
                // }
            },
            error => {
                let messageError = [];
                if (!Array.isArray(error.error)) {
                    messageError.push(error.error);
                } else {
                    messageError = error.error;
                }
                Object.entries(messageError).forEach(
                    ([key, value]) => this.toastService.growl('error', key + ': ' + value)
                );
            }
        );
    }

    public isValid() {
        let stringClass = 'form-control form-control-lg form-control-solid';
        if (this.touched) {
            if (this.valid) {
                stringClass += ' is-valid';
            } else {
                stringClass += ' is-invalid';
            }
        }
        return stringClass;
    }
}
