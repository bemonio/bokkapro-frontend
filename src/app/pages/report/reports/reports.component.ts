import { Component, OnInit, ViewChild, ElementRef  } from '@angular/core';
import { FormGroup, AbstractControl, FormBuilder, Validators, FormControl } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { LazyLoadEvent } from 'primeng/api';
import { ConfirmationService } from 'primeng/api';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';
import { ToastService } from 'src/app/modules/toast/_services/toast.service';
import { AuthService } from 'src/app/modules/auth';
import { environment } from '../../../../environments/environment';
import { DomSanitizer } from '@angular/platform-browser';
import { TokenStorageService } from './../../../modules/auth/_services/auth-http/token-storage.service';

@Component({
    selector: 'app-reports',
    templateUrl: './reports.component.html',
    styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {
    REPORT_URL = `${environment.reportUrl}`;

    @ViewChild('iframe') iframe: ElementRef

    constructor(
        public translate: TranslateService,
        private confirmationService: ConfirmationService,
        private toastService: ToastService,
        public authService: AuthService,
        public sanitizer: DomSanitizer,
        private token: TokenStorageService,
        fb: FormBuilder) {

    }

    ngOnInit() {
    }

    ngAfterViewInit() {
        //TODO: pasar el token, el userid, el employeeid
        this.iframe.nativeElement.setAttribute('src', this.REPORT_URL + '/token=' + this.token.getToken());
    }
}
