import { Component, forwardRef, Renderer2, ViewChild, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';
import { TypeCompanyService as ModelsService } from '../../_services/type-company.service';
import { LazyLoadEvent } from 'primeng/api';

export const EPANDED_TEXTAREA_VALUE_ACCESSOR: any = {
  provide: NG_VALUE_ACCESSOR,
  useExisting: forwardRef(() => TypeCompanyAutocompleteComponent),
  multi: true,
};

@Component({
  selector: 'app-autocomplete-type-company',
  templateUrl: './autocomplete-type-company.component.html',
  styleUrls: ['./autocomplete-type-company.component.scss'],
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
        public modelsService: ModelsService
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
        if (event.sortOrder === -1) {
            this.sort =  '-' + event.sortField;
        } else {
            this.sort =  event.sortField;
        }

        if (event.globalFilter) {
            this.query = event.globalFilter;
        } else {
            this.query = undefined;
        }

        if (event.rows) {
            this.per_page = event.rows;
        }

        this.sort = '-id';
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
                // this.toastService.growl('error', error);
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
