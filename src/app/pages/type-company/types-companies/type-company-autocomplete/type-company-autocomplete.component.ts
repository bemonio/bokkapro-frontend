import { Component, forwardRef, Renderer2, ViewChild, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TypeCompanyService as ModelsService } from '../../_services/type-company.service';
import { LazyLoadEvent } from 'primeng/api';
import { ToastService } from 'src/app/modules/toast/_services/toast.service';

export const EPANDED_TEXTAREA_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => TypeCompanyAutocompleteComponent),
  multi: true,
};

@Component({
  selector: 'app-type-company-autocomplete',
  templateUrl: './type-company-autocomplete.component.html',
  styleUrls: ['./type-company-autocomplete.component.scss'],
  providers: [EPANDED_TEXTAREA_VALUE_ACCESSOR],
})
export class TypeCompanyAutocompleteComponent implements ControlValueAccessor, OnInit {
    @Input() model: any;
    @Input() valid: boolean;
    @Input() touched: boolean;
    @Input() required: boolean;
    @Input() disabled: boolean;
    @Input() placeholder: string;

    public models: any[];
    
    public onChange;
    public onTouched;

    public firstTime: boolean;
    public totalRecords: number;
    public page: number;
    public per_page: number;
    public sort: string;
    public query: string;
    public filters: {key: string, value: string}[];

    public value: any;

    constructor(
        public modelsService: ModelsService,
        public toastService: ToastService
    ) {
        this.page = 1;
        this.per_page = 1;
        this.firstTime = true;
    }

    public ngOnInit() {
        if (!this.placeholder) {
            this.placeholder = 'Type TypeCompany';
        }
    }

    writeValue(value: any ) {
        // const div = this.textarea.nativeElement;
        // this.renderer.setProperty(div, 'textContent', value);
        if (value) {
            this.value = value;
        }
    }

    registerOnChange(fn: any ) {
        this.onChange = fn;
    }

    registerOnTouched(fn: any ) {
        this.onTouched = fn;
    }

    setDisabledState(isDisabled: boolean ) {
        this.disabled = isDisabled;
    }

    public change($event) {
        this.onChange(this.value);
        this.onTouched(this.value);
    }

    public loadLazy(event: LazyLoadEvent) {
        if (event.sortField) {
            if (event.sortOrder === -1) {
                this.sort =  '-' + event.sortField;
            } else {
                this.sort =  event.sortField;
            }
        } else {
            this.sort = '-id';
        }

        if (event.globalFilter) {
            this.query = event.globalFilter;
        } else {
            this.query = undefined;
        }

        if (event.rows) {
            this.per_page = event.rows;
        }

        
        if (!this.firstTime) {
            this.getModels();
        }
        this.firstTime = false;
    }

    getModels() {
        this.modelsService.get(this.page, this.per_page, this.sort, this.query, this.filters).toPromise().then(
            response => {
                this.models = response.type_companies;
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
                Object.entries(error.error).forEach(
                    ([key, value]) =>  this.toastService.growl('error', key + ': ' + value)
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
