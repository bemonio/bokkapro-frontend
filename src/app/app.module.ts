import { NgModule, APP_INITIALIZER } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { HttpClientInMemoryWebApiModule } from 'angular-in-memory-web-api';
import { ClipboardModule } from 'ngx-clipboard';
import { TranslateModule } from '@ngx-translate/core';
import { InlineSVGModule } from 'ng-inline-svg';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { PagesModule } from './pages/pages.module';
import { AuthService } from './modules/auth/_services/auth.service';
import { environment } from 'src/environments/environment';
// Highlight JS
import { HighlightModule, HIGHLIGHT_OPTIONS } from 'ngx-highlightjs';
import highlight from 'highlight.js/lib/highlight';
import xml from 'highlight.js/lib/languages/xml';
import json from 'highlight.js/lib/languages/json';
import scss from 'highlight.js/lib/languages/scss';
import typescript from 'highlight.js/lib/languages/typescript';
import { SplashScreenModule } from './_metronic/partials/layout/splash-screen/splash-screen.module';
// #fake-start#
import { FakeAPIService } from './_fake/fake-api.service';
// #fake-end#
import { authInterceptorProviders } from './modules/auth/_helpers/auth.interceptor';

import { UserService } from './pages/user/_services';
import { SegmentCompanyService } from './pages/segment-company/_services';
import { TypeCompanyService } from './pages/type-company/_services';
import { ConfirmationService } from 'primeng/api';
import { CompanyService } from './pages/company/_services';
import { TypeDivisionService } from './pages/type-division/_services';
import { DivisionService } from './pages/division/_services';
import { DepartmentService } from './pages/department/_services';
import { OfficeService } from './pages/office/_services';
import { PositionService } from './pages/position/_services';
import { EmployeeService } from './pages/employee/_services';
import { TypeLocationService } from './pages/type-location/_services';
import { LocationService } from './pages/location/_services';
import { ZoneService } from './pages/zone/_services';
import { TypeGuideService } from './pages/type-guide/_services';
import { GuideService } from './pages/guide/_services';
import { PackageService } from './pages/package/_services';
import { VoucherService } from './pages/voucher/_services';
import { CurrencyService } from './pages/currency/_services';
import { CurrencyDetailService } from './pages/currency-detail/_services';
import { ExchangeService } from './pages/exchange/_services';
import { BankAccountService } from './pages/bank-account/_services';
import { ModerationService } from './pages/moderation/_services';

function appInitializer(authService: AuthService) {
  return () => {
    return new Promise((resolve) => {
      authService.getUserByToken().subscribe().add(resolve);
    });
  };
}

/**
 * Import specific languages to avoid importing everything
 * The following will lazy load highlight.js core script (~9.6KB) + the selected languages bundle (each lang. ~1kb)
 */
export function getHighlightLanguages() {
  return [
    { name: 'typescript', func: typescript },
    { name: 'scss', func: scss },
    { name: 'xml', func: xml },
    { name: 'json', func: json },
  ];
}

@NgModule({
  declarations: [AppComponent],
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    SplashScreenModule,
    TranslateModule.forRoot(),
    HttpClientModule,
    HighlightModule,
    ClipboardModule,
    // #fake-start#
    environment.isMockEnabled
      ? HttpClientInMemoryWebApiModule.forRoot(FakeAPIService, {
        passThruUnknownUrl: true,
        dataEncapsulation: false,
      })
      : [],
    // #fake-end#
    AppRoutingModule,
    InlineSVGModule.forRoot(),
    NgbModule,
    PagesModule
  ],
  providers: [
    authInterceptorProviders,
    {
      provide: APP_INITIALIZER,
      useFactory: appInitializer,
      multi: true,
      deps: [AuthService],
    },
    {
      provide: HIGHLIGHT_OPTIONS,
      useValue: {
        languages: getHighlightLanguages,
      },
    },
    UserService,
    SegmentCompanyService,
    TypeCompanyService,
    ConfirmationService,
    CompanyService,
    TypeDivisionService,
    DivisionService,
    DepartmentService,
    OfficeService,
    PositionService,
    EmployeeService,
    TypeLocationService,
    LocationService,
    ZoneService,
    TypeGuideService,
    GuideService,
    PackageService,
    ModerationService,
    VoucherService,
    CurrencyService,
    CurrencyDetailService,
    ExchangeService,
    BankAccountService,
  ],
  bootstrap: [AppComponent],
})
export class AppModule { }
