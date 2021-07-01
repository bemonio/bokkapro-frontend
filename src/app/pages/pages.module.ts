import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { InlineSVGModule } from 'ng-inline-svg';

import { TableModule }  from 'primeng/table';
import { ToggleButtonModule } from 'primeng/togglebutton';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { FileUploadModule } from 'primeng/fileupload';
import { DialogModule } from 'primeng/dialog';
import { CalendarModule } from 'primeng/calendar';
import { DropdownModule } from 'primeng/dropdown';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { BadgeModule } from 'primeng/badge';
import { ChipsModule } from 'primeng/chips';
import { MultiSelectModule } from 'primeng/multiselect';
import { EditorModule } from 'primeng/editor';
import { FullCalendarModule } from 'primeng/fullcalendar';

import { ImageCropperModule } from 'ngx-image-cropper';

import { CurrencyMaskModule } from "ng2-currency-mask";

import { TranslateModule } from '@ngx-translate/core';

// import { CompanyModule } from './company/company.module';
// import { TypeCompanyModule } from './type-company/type-company.module';

// Users
import { UsersComponent } from './user/users/users.component';
import { UserComponent } from './user/user.component';
import { UserEditComponent } from './user/users/user-edit/user-edit.component';
import { UserAutocompleteComponent } from './user/users/user-autocomplete/user-autocomplete.component';

// TypeCompanies
import { TypesCompaniesComponent } from './type-company/types-companies/types-companies.component';
import { TypeCompanyComponent } from './type-company/type-company.component';
import { TypeCompanyEditComponent } from './type-company/types-companies/type-company-edit/type-company-edit.component';
import { TypeCompanyAutocompleteComponent } from './type-company/types-companies/type-company-autocomplete/type-company-autocomplete.component';

// SegmentCompanies
import { SegmentsCompaniesComponent } from './segment-company/segments-companies/segments-companies.component';
import { SegmentCompanyComponent } from './segment-company/segment-company.component';
import { SegmentCompanyEditComponent } from './segment-company/segments-companies/segment-company-edit/segment-company-edit.component';
import { SegmentCompanyAutocompleteComponent } from './segment-company/segments-companies/segment-company-autocomplete/segment-company-autocomplete.component';

// Companies
import { CompaniesComponent } from './company/companies/companies.component';
import { CompanyComponent } from './company/company.component';
import { CompanyEditComponent } from './company/companies/company-edit/company-edit.component';
import { CompanyAutocompleteComponent } from './company/companies/company-autocomplete/company-autocomplete.component';

// Departments
import { DepartmentsComponent } from './department/departments/departments.component';
import { DepartmentComponent } from './department/department.component';
import { DepartmentEditComponent } from './department/departments/department-edit/department-edit.component';
import { DepartmentAutocompleteComponent } from './department/departments/department-autocomplete/department-autocomplete.component';

// TypesDivisions
import { TypesDivisionsComponent } from './type-division/types-divisions/types-divisions.component';
import { TypeDivisionComponent } from './type-division/type-division.component';
import { TypeDivisionEditComponent } from './type-division/types-divisions/type-division-edit/type-division-edit.component';
import { TypeDivisionAutocompleteComponent } from './type-division/types-divisions/type-division-autocomplete/type-division-autocomplete.component';
import { TypeDivisionSelectComponent } from './type-division/types-divisions/type-division-select/type-division-select.component';


// Divisions
import { DivisionsComponent } from './division/divisions/divisions.component';
import { DivisionComponent } from './division/division.component';
import { DivisionEditComponent } from './division/divisions/division-edit/division-edit.component';
import { DivisionAutocompleteComponent } from './division/divisions/division-autocomplete/division-autocomplete.component';

// Offices
import { OfficesComponent } from './office/offices/offices.component';
import { OfficeComponent } from './office/office.component';
import { OfficeEditComponent } from './office/offices/office-edit/office-edit.component';
import { OfficeAutocompleteComponent } from './office/offices/office-autocomplete/office-autocomplete.component';

// Positions
import { PositionsComponent } from './position/positions/positions.component';
import { PositionComponent } from './position/position.component';
import { PositionEditComponent } from './position/positions/position-edit/position-edit.component';
import { PositionAutocompleteComponent } from './position/positions/position-autocomplete/position-autocomplete.component';

// Employees
import { EmployeesComponent } from './employee/employees/employees.component';
import { EmployeeComponent } from './employee/employee.component';
import { EmployeeEditComponent } from './employee/employees/employee-edit/employee-edit.component';
import { EmployeeAutocompleteComponent } from './employee/employees/employee-autocomplete/employee-autocomplete.component';
import { EmployeeMultiselectComponent } from './employee/employees/employee-multiselect/employee-multiselect.component';

// TypesLocations
import { TypesLocationsComponent } from './type-location/types-locations/types-locations.component';
import { TypeLocationComponent } from './type-location/type-location.component';
import { TypeLocationEditComponent } from './type-location/types-locations/type-location-edit/type-location-edit.component';
import { TypeLocationAutocompleteComponent } from './type-location/types-locations/type-location-autocomplete/type-location-autocomplete.component';

// Locations
import { LocationsComponent } from './location/locations/locations.component';
import { LocationComponent } from './location/location.component';
import { LocationEditComponent } from './location/locations/location-edit/location-edit.component';
import { LocationAutocompleteComponent } from './location/locations/location-autocomplete/location-autocomplete.component';

// Zones
import { ZonesComponent } from './zone/zones/zones.component';
import { ZoneComponent } from './zone/zone.component';
import { ZoneEditComponent } from './zone/zones/zone-edit/zone-edit.component';
import { ZoneAutocompleteComponent } from './zone/zones/zone-autocomplete/zone-autocomplete.component';

// TypesGuides
import { TypesGuidesComponent } from './type-guide/types-guides/types-guides.component';
import { TypeGuideComponent } from './type-guide/type-guide.component';
import { TypeGuideEditComponent } from './type-guide/types-guides/type-guide-edit/type-guide-edit.component';
import { TypeGuideAutocompleteComponent } from './type-guide/types-guides/type-guide-autocomplete/type-guide-autocomplete.component';

// Guides
import { GuidesComponent } from './guide/guides/guides.component';
import { GuideComponent } from './guide/guide.component';
import { GuideEditComponent } from './guide/guides/guide-edit/guide-edit.component';
import { GuideAutocompleteComponent } from './guide/guides/guide-autocomplete/guide-autocomplete.component';

// Packings
import { PackingsComponent } from './packing/packings/packings.component';
import { PackingComponent } from './packing/packing.component';
import { PackingEditComponent } from './packing/packings/packing-edit/packing-edit.component';
import { PackingAutocompleteComponent } from './packing/packings/packing-autocomplete/packing-autocomplete.component';

// DepositForms
import { DepositFormsComponent } from './deposit-form/deposit-forms/deposit-forms.component';
import { DepositFormComponent } from './deposit-form/deposit-form.component';
import { DepositFormEditComponent } from './deposit-form/deposit-forms/deposit-form-edit/deposit-form-edit.component';
import { DepositFormAutocompleteComponent } from './deposit-form/deposit-forms/deposit-form-autocomplete/deposit-form-autocomplete.component';

// DepositFormsDetails
import { DepositFormsDetailsComponent } from './deposit-formdetail/deposit-formsdetails/deposit-formsdetails.component';
import { DepositFormDetailComponent } from './deposit-formdetail/deposit-formdetail.component';
import { DepositFormDetailEditComponent } from './deposit-formdetail/deposit-formsdetails/deposit-formdetail-edit/deposit-formdetail-edit.component';

// Vouchers
import { VouchersComponent } from './voucher/vouchers/vouchers.component';
import { VoucherComponent } from './voucher/voucher.component';
import { VoucherEditComponent } from './voucher/vouchers/voucher-edit/voucher-edit.component';
import { VoucherAutocompleteComponent } from './voucher/vouchers/voucher-autocomplete/voucher-autocomplete.component';

// Currencies
import { CurrenciesComponent } from './currency/currencies/currencies.component';
import { CurrencyComponent } from './currency/currency.component';
import { CurrencyEditComponent } from './currency/currencies/currency-edit/currency-edit.component';
import { CurrencySelectComponent } from './currency/currencies/currency-select/currency-select.component';

// TypesCurrencies
import { TypesCurrenciesComponent } from './type-currency/types-currencies/types-currencies.component';
import { TypeCurrencyComponent } from './type-currency/type-currency.component';
import { TypeCurrencyEditComponent } from './type-currency/types-currencies/type-currency-edit/type-currency-edit.component';
import { TypeCurrencySelectComponent } from './type-currency/types-currencies/type-currency-select/type-currency-select.component';


// CurrenciesDetails
import { CurrenciesDetailsComponent } from './currency-detail/currencies-details/currencies-details.component';
import { CurrencyDetailComponent } from './currency-detail/currency-detail.component';
import { CurrencyDetailEditComponent } from './currency-detail/currencies-details/currency-detail-edit/currency-detail-edit.component';
import { CurrencyDetailAutocompleteComponent } from './currency-detail/currencies-details/currency-detail-autocomplete/currency-detail-autocomplete.component';

// Exchanges
import { ExchangesComponent } from './exchange/exchanges/exchanges.component';
import { ExchangeComponent } from './exchange/exchange.component';
import { ExchangeEditComponent } from './exchange/exchanges/exchange-edit/exchange-edit.component';

// BanksAccounts
import { BanksAccountsComponent } from './bank-account/banks-accounts/banks-accounts.component';
import { BankAccountComponent } from './bank-account/bank-account.component';
import { BankAccountEditComponent } from './bank-account/banks-accounts/bank-account-edit/bank-account-edit.component';
import { BankAccountAutocompleteComponent } from './bank-account/banks-accounts/bank-account-autocomplete/bank-account-autocomplete.component';

// Contracts
import { ContractsComponent } from './contract/contracts/contracts.component';
import { ContractComponent } from './contract/contract.component';
import { ContractEditComponent } from './contract/contracts/contract-edit/contract-edit.component';
import { ContractAutocompleteComponent } from './contract/contracts/contract-autocomplete/contract-autocomplete.component';

// TypesContracts
import { TypesContractsComponent } from './type-contract/types-contracts/types-contracts.component';
import { TypeContractComponent } from './type-contract/type-contract.component';
import { TypeContractEditComponent } from './type-contract/types-contracts/type-contract-edit/type-contract-edit.component';
import { TypeContractSelectComponent } from './type-contract/types-contracts/type-contract-select/type-contract-select.component';

// CompanyContacts
import { CompanyContactsComponent } from './company-contact/company-contacts/company-contacts.component';
import { CompanyContactComponent } from './company-contact/company-contact.component';
import { CompanyContactEditComponent } from './company-contact/company-contacts/company-contact-edit/company-contact-edit.component';
import { CompanyContactAutocompleteComponent } from './company-contact/company-contacts/company-contact-autocomplete/company-contact-autocomplete.component';

// Moderations
import { ModerationsComponent } from './moderation/moderations/moderations.component';
import { ModerationComponent } from './moderation/moderation.component';
import { ModerationEditComponent } from './moderation/moderations/moderation-edit/moderation-edit.component';
import { ModerationAutocompleteComponent } from './moderation/moderations/moderation-autocomplete/moderation-autocomplete.component';

// QuoteTemplates
import { QuoteTemplatesComponent } from './quote-template/quote-templates/quote-templates.component';
import { QuoteTemplateComponent } from './quote-template/quote-template.component';
import { QuoteTemplateEditComponent } from './quote-template/quote-templates/quote-template-edit/quote-template-edit.component';
import { QuoteTemplateAutocompleteComponent } from './quote-template/quote-templates/quote-template-autocomplete/quote-template-autocomplete.component';

// Quotations
import { QuotationsComponent } from './quotation/quotations/quotations.component';
import { QuotationComponent } from './quotation/quotation.component';
import { QuotationEditComponent } from './quotation/quotations/quotation-edit/quotation-edit.component';

// ReportOperations
import { ReportOperationsComponent } from './report-operation/report-operations/report-operations.component';
import { ReportOperationComponent } from './report-operation/report-operation.component';
import { ReportOperationEditComponent } from './report-operation/report-operations/report-operation-edit/report-operation-edit.component';

// Clauses
import { ClausesComponent } from './clause/clauses/clauses.component';
import { ClauseComponent } from './clause/clause.component';
import { ClauseEditComponent } from './clause/clauses/clause-edit/clause-edit.component';
import { ClauseAutocompleteComponent } from './clause/clauses/clause-autocomplete/clause-autocomplete.component';

// Crews
import { CrewsComponent } from './crew/crews/crews.component';
import { CrewComponent } from './crew/crew.component';
import { CrewEditComponent } from './crew/crews/crew-edit/crew-edit.component';
import { CrewAutocompleteComponent } from './crew/crews/crew-autocomplete/crew-autocomplete.component';

// CertifiedCarts
import { CertifiedCartsComponent } from './certified-cart/certified-carts/certified-carts.component';
import { CertifiedCartComponent } from './certified-cart/certified-cart.component';
import { CertifiedCartEditComponent } from './certified-cart/certified-carts/certified-cart-edit/certified-cart-edit.component';

// Vehicles
import { VehiclesComponent } from './vehicle/vehicles/vehicles.component';
import { VehicleComponent } from './vehicle/vehicle.component';
import { VehicleEditComponent } from './vehicle/vehicles/vehicle-edit/vehicle-edit.component';
import { VehicleAutocompleteComponent } from './vehicle/vehicles/vehicle-autocomplete/vehicle-autocomplete.component';

@NgModule({
  imports: [
    CommonModule,
    TableModule,
    FileUploadModule,
    DialogModule,
    ConfirmDialogModule,
    AutoCompleteModule,
    BadgeModule,
    ChipsModule,
    MultiSelectModule,
    EditorModule,
    FullCalendarModule,
    CurrencyMaskModule,
    ToggleButtonModule,
    CalendarModule,
    DropdownModule,
    ImageCropperModule,
    // CompanyModule,
    // TypeCompanyModule,
    FormsModule,
    ReactiveFormsModule,
    RouterModule,
    InlineSVGModule,
    TranslateModule.forRoot(),
  ],
  declarations: [
    UsersComponent,
    UserComponent,
    UserEditComponent,
    UserAutocompleteComponent,
    TypesCompaniesComponent,
    TypeCompanyComponent,
    TypeCompanyEditComponent,
    TypeCompanyAutocompleteComponent,
    SegmentsCompaniesComponent,
    SegmentCompanyComponent,
    SegmentCompanyEditComponent,
    SegmentCompanyAutocompleteComponent,
    CompaniesComponent,
    CompanyComponent,
    CompanyEditComponent,
    CompanyAutocompleteComponent,
    OfficesComponent,
    OfficeComponent,
    OfficeEditComponent,
    OfficeAutocompleteComponent,
    DepartmentsComponent,
    DepartmentComponent,
    DepartmentEditComponent,
    DepartmentAutocompleteComponent,
    TypesDivisionsComponent,
    TypeDivisionComponent,
    TypeDivisionEditComponent,
    TypeDivisionAutocompleteComponent,
    TypeDivisionSelectComponent,
    DivisionsComponent,
    DivisionComponent,
    DivisionEditComponent,
    DivisionAutocompleteComponent,
    PositionsComponent,
    PositionComponent,
    PositionEditComponent,
    PositionAutocompleteComponent,
    EmployeesComponent,
    EmployeeComponent,
    EmployeeEditComponent,
    EmployeeAutocompleteComponent,
    EmployeeMultiselectComponent,
    TypesLocationsComponent,
    TypeLocationComponent,
    TypeLocationEditComponent,
    TypeLocationAutocompleteComponent,
    LocationsComponent,
    LocationComponent,
    LocationEditComponent,
    LocationAutocompleteComponent,
    ZonesComponent,
    ZoneComponent,
    ZoneEditComponent,
    ZoneAutocompleteComponent,
    TypesGuidesComponent,
    TypeGuideComponent,
    TypeGuideEditComponent,
    TypeGuideAutocompleteComponent,
    GuidesComponent,
    GuideComponent,
    GuideEditComponent,
    GuideAutocompleteComponent,
    PackingsComponent,
    PackingComponent,
    PackingEditComponent,
    PackingAutocompleteComponent,
    DepositFormsComponent,
    DepositFormComponent,
    DepositFormEditComponent,
    DepositFormAutocompleteComponent,
    DepositFormsDetailsComponent,
    DepositFormDetailComponent,
    DepositFormDetailEditComponent,
    VouchersComponent,
    VoucherComponent,
    VoucherEditComponent,
    VoucherAutocompleteComponent,
    CurrenciesComponent,
    CurrencyComponent,
    CurrencyEditComponent,
    CurrencySelectComponent,
    CurrenciesDetailsComponent,
    CurrencyDetailComponent,
    CurrencyDetailEditComponent,
    CurrencyDetailAutocompleteComponent,
    TypesCurrenciesComponent,
    TypeCurrencyComponent,
    TypeCurrencyEditComponent,
    TypeCurrencySelectComponent,
    ExchangesComponent,
    ExchangeComponent,
    ExchangeEditComponent,
    BanksAccountsComponent,
    BankAccountComponent,
    BankAccountEditComponent,
    BankAccountAutocompleteComponent,
    ContractsComponent,
    ContractComponent,
    ContractEditComponent,
    ContractAutocompleteComponent,
    TypesContractsComponent,
    TypeContractComponent,
    TypeContractEditComponent,
    TypeContractSelectComponent,
    CompanyContactsComponent,
    CompanyContactComponent,
    CompanyContactEditComponent,
    CompanyContactAutocompleteComponent,
    ModerationsComponent,
    ModerationComponent,
    ModerationEditComponent,
    ModerationAutocompleteComponent,
    QuoteTemplatesComponent,
    QuoteTemplateComponent,
    QuoteTemplateEditComponent,
    QuoteTemplateAutocompleteComponent,
    QuotationsComponent,
    QuotationComponent,
    QuotationEditComponent,
    ReportOperationsComponent,
    ReportOperationComponent,
    ReportOperationEditComponent,
    ClausesComponent,
    ClauseComponent,
    ClauseEditComponent,
    ClauseAutocompleteComponent,
    CrewsComponent,
    CrewComponent,
    CrewEditComponent,
    CrewAutocompleteComponent,
    CertifiedCartsComponent,
    CertifiedCartComponent,
    CertifiedCartEditComponent,
    VehiclesComponent,
    VehicleComponent,
    VehicleEditComponent,
    VehicleAutocompleteComponent
  ]
})
export class PagesModule { }
