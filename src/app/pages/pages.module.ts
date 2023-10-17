import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { InlineSVGModule } from 'ng-inline-svg';

// PrimeFace
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
import { SidebarModule } from 'primeng/sidebar';
import { TimelineModule } from 'primeng/timeline';
import { CardModule } from 'primeng/card';

// FullCalendar
import { FullCalendarModule } from '@fullcalendar/angular';
import dayGridPlugin from '@fullcalendar/daygrid';
import timeGridPlugin from '@fullcalendar/timegrid';
import listPlugin from '@fullcalendar/list';
import interactionPlugin from '@fullcalendar/interaction';

FullCalendarModule.registerPlugins([
  dayGridPlugin,
  timeGridPlugin,
  listPlugin,
  interactionPlugin
]);

// ImageCropperModule
import { ImageCropperModule } from 'ngx-image-cropper';

// CurrencyMaskModule
import { CurrencyMaskModule } from "ng2-currency-mask";

// TranslateModule
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
import { DivisionSelectComponent } from './division/divisions/division-select/division-select.component';

// Offices
import { OfficesComponent } from './office/offices/offices.component';
import { OfficeComponent } from './office/office.component';
import { OfficeEditComponent } from './office/offices/office-edit/office-edit.component';
import { OfficeAutocompleteComponent } from './office/offices/office-autocomplete/office-autocomplete.component';
import { OfficeMultiselectComponent } from './office/offices/office-multiselect/office-multiselect.component';

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
import { VoucherAddListComponent } from './voucher/vouchers/voucher-add-list/voucher-add-list.component';
import { VoucherAutocompleteComponent } from './voucher/vouchers/voucher-autocomplete/voucher-autocomplete.component';

// VouchersSecurities
import { VouchersSecuritiesComponent } from './voucher-security/vouchers-securities/vouchers-securities.component';
import { VoucherSecurityComponent } from './voucher-security/voucher-security.component';
import { VoucherSecurityEditComponent } from './voucher-security/vouchers-securities/voucher-security-edit/voucher-security-edit.component';
import { VoucherSecurityAddListComponent } from './voucher-security/vouchers-securities/voucher-security-add-list/voucher-security-add-list.component';
import { VoucherSecurityAutocompleteComponent } from './voucher-security/vouchers-securities/voucher-security-autocomplete/voucher-security-autocomplete.component';

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

// Reports
import { ReportsComponent } from './report/reports/reports.component';
import { ReportComponent } from './report/report.component';

// ReportRequests
import { ReportRequestsComponent } from './report-request/report-requests/report-requests.component';
import { ReportRequestComponent } from './report-request/report-request.component';

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

// ProductAndServices
import { ProductAndServicesComponent } from './product-and-service/product-and-services/product-and-services.component';
import { ProductAndServiceComponent } from './product-and-service/product-and-service.component';
import { ProductAndServiceEditComponent } from './product-and-service/product-and-services/product-and-service-edit/product-and-service-edit.component';
import { ProductAndServiceSelectComponent } from './product-and-service/product-and-services/product-and-service-select/product-and-service-select.component';

// Rates
import { RatesComponent } from './rate/rates/rates.component';
import { RateComponent } from './rate/rate.component';
import { RateEditComponent } from './rate/rates/rate-edit/rate-edit.component';
import { RateAutocompleteComponent } from './rate/rates/rate-autocomplete/rate-autocomplete.component';

// DocumentsServicesOrders
import { DocumentsServicesOrdersComponent } from './document-service-order/documents-services-orders/documents-services-orders.component';
import { DocumentServiceOrderComponent } from './document-service-order/document-service-order.component';
import { DocumentServiceOrderEditComponent } from './document-service-order/documents-services-orders/document-service-order-edit/document-service-order-edit.component';

// ServiceOrders
import { ServiceOrdersComponent } from './service-order/service-orders/service-orders.component';
import { ServiceOrderComponent } from './service-order/service-order.component';
import { ServiceOrderEditComponent } from './service-order/service-orders/service-order-edit/service-order-edit.component';
import { ServiceOrderSelectComponent } from './service-order/service-orders/service-order-select/service-order-select.component';
import { ServiceOrderAutocompleteComponent } from './service-order/service-orders/service-order-autocomplete/service-order-autocomplete.component';

// OriginDestinations
import { OriginDestinationsComponent } from './origin-destination/origin-destinations/origin-destinations.component';
import { OriginDestinationComponent } from './origin-destination/origin-destination.component';
import { OriginDestinationEditComponent } from './origin-destination/origin-destinations/origin-destination-edit/origin-destination-edit.component';
import { OriginDestinationSelectComponent } from './origin-destination/origin-destinations/origin-destination-select/origin-destination-select.component';

// ClientBinnacles
import { ClientBinnaclesComponent } from './client-binnacle/client-binnacles/client-binnacles.component';
import { ClientBinnacleComponent } from './client-binnacle/client-binnacle.component';
import { ClientBinnacleEditComponent } from './client-binnacle/client-binnacles/client-binnacle-edit/client-binnacle-edit.component';

// Notifications
import { NotificationsComponent } from './notification/notifications/notifications.component';
import { NotificationComponent } from './notification/notification.component';
import { NotificationEditComponent } from './notification/notifications/notification-edit/notification-edit.component';

// ToursDetails
import { ToursDetailsComponent } from './tour-detail/tours-details/tours-details.component';
import { TourDetailComponent } from './tour-detail/tour-detail.component';
import { TourDetailEditComponent } from './tour-detail/tours-details/tour-detail-edit/tour-detail-edit.component';

// Permission
import { PermissionsComponent } from './permission/permissions/permissions.component';
import { PermissionComponent } from './permission/permission.component';
import { PermissionEditComponent } from './permission/permissions/permission-edit/permission-edit.component';
import { PermissionAutocompleteComponent } from './permission/permissions/permission-autocomplete/permission-autocomplete.component';
import { PermissionMultiselectComponent } from './permission/permissions/permission-multiselect/permission-multiselect.component';

// Groups
import { GroupsComponent } from './group/groups/groups.component';
import { GroupComponent } from './group/group.component';
import { GroupEditComponent } from './group/groups/group-edit/group-edit.component';
import { GroupAutocompleteComponent } from './group/groups/group-autocomplete/group-autocomplete.component';
import { GroupMultiselectComponent } from './group/groups/group-multiselect/group-multiselect.component';

// ContentTypes
import { ContentTypesComponent } from './content-type/content-types/content-types.component';
import { ContentTypeComponent } from './content-type/content-type.component';
import { ContentTypeEditComponent } from './content-type/content-types/content-type-edit/content-type-edit.component';
import { ContentTypeSelectComponent } from './content-type/content-types/content-type-select/content-type-select.component';
import { ContentTypeAutocompleteComponent } from './content-type/content-types/content-type-autocomplete/content-type-autocomplete.component';

// Chests
import { ChestsComponent } from './chest/chests/chests.component';
import { ChestComponent } from './chest/chest.component';
import { ChestEditComponent } from './chest/chests/chest-edit/chest-edit.component';

// TypeChests
import { TypesChestsComponent } from './type-chest/types-chests/types-chests.component';
import { TypeChestComponent } from './type-chest/type-chest.component';
import { TypeChestEditComponent } from './type-chest/types-chests/type-chest-edit/type-chest-edit.component';
import { TypeChestSelectComponent } from './type-chest/types-chests/type-chest-select/type-chest-select.component';

// ProductParts
import { ProductPartsComponent } from './product-part/product-parts/product-parts.component';
import { ProductPartComponent } from './product-part/product-part.component';
import { ProductPartEditComponent } from './product-part/product-parts/product-part-edit/product-part-edit.component';

// TypeProductTransactions
import { TypesProductTransactionsComponent } from './type-product-transaction/types-product-transactions/types-product-transactions.component';
import { TypeProductTransactionComponent } from './type-product-transaction/type-product-transaction.component';
import { TypeProductTransactionEditComponent } from './type-product-transaction/types-product-transactions/type-product-transaction-edit/type-product-transaction-edit.component';
import { TypeProductTransactionSelectComponent } from './type-product-transaction/types-product-transactions/type-product-transaction-select/type-product-transaction-select.component';

// Stocks
import { StocksComponent } from './stock/stocks/stocks.component';
import { StockComponent } from './stock/stock.component';
import { StockEditComponent } from './stock/stocks/stock-edit/stock-edit.component';

// StockTransactions
import { StockTransactionsComponent } from './stock-transaction/stock-transactions/stock-transactions.component';
import { StockTransactionComponent } from './stock-transaction/stock-transaction.component';
import { StockTransactionEditComponent } from './stock-transaction/stock-transactions/stock-transaction-edit/stock-transaction-edit.component';

// StockTransactionDetails
import { StockTransactionDetailsComponent } from './stock-transaction-detail/stock-transaction-details/stock-transaction-details.component';
import { StockTransactionDetailComponent } from './stock-transaction-detail/stock-transaction-detail.component';
import { StockTransactionDetailEditComponent } from './stock-transaction-detail/stock-transaction-details/stock-transaction-detail-edit/stock-transaction-detail-edit.component';
import { StockTransactionAutocompleteComponent } from './stock-transaction/stock-transactions/stock-transaction-autocomplete/stock-transaction-autocomplete.component';

// StockSerials
import { StockSerialsComponent } from './stock-serial/stock-serials/stock-serials.component';
import { StockSerialComponent } from './stock-serial/stock-serial.component';
import { StockSerialEditComponent } from './stock-serial/stock-serials/stock-serial-edit/stock-serial-edit.component';

// HeadInvoices
import { HeadInvoicesComponent } from './head-invoice/head-invoices/head-invoices.component';
import { HeadInvoiceComponent } from './head-invoice/head-invoice.component';
import { HeadInvoiceEditComponent } from './head-invoice/head-invoices/head-invoice-edit/head-invoice-edit.component';
import { HeadInvoiceAutocompleteComponent } from './head-invoice/head-invoices/head-invoice-autocomplete/head-invoice-autocomplete.component';

// InvoiceItems
import { InvoiceItemsComponent } from './invoice-item/invoice-items/invoice-items.component';
import { InvoiceItemComponent } from './invoice-item/invoice-item.component';
import { InvoiceItemEditComponent } from './invoice-item/invoice-items/invoice-item-edit/invoice-item-edit.component';

//FormInvoice
import { InvoicesComponent } from './invoice/invoices/invoices.component';
import { InvoiceComponent } from './invoice/invoice.component';
import { InvoiceEditComponent } from './invoice/invoices/invoice-edit/invoice-edit.component';

// TypeServiceOrders
import { TypesServiceOrdersComponent } from './type-service-order/types-service-orders/types-service-orders.component';
import { TypeServiceOrderComponent } from './type-service-order/type-service-order.component';
import { TypeServiceOrderEditComponent } from './type-service-order/types-service-orders/type-service-order-edit/type-service-order-edit.component';
import { TypeServiceOrderSelectComponent } from './type-service-order/types-service-orders/type-service-order-select/type-service-order-select.component';

// PasswordsSettings
import { PasswordsSettingsComponent } from './password-setting/passwords-settings/passwords-settings.component';
import { PasswordSettingComponent } from './password-setting/password-setting.component';
import { PasswordSettingEditComponent } from './password-setting/passwords-settings/password-setting-edit/password-setting-edit.component';

// ChangesPassword
import { ChangePasswordComponent } from './change-password/change-password.component';

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
    SidebarModule,
    TimelineModule,
    CardModule,
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
    OfficeMultiselectComponent,
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
    DivisionSelectComponent,
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
    VoucherAddListComponent,
    VoucherAutocompleteComponent,
    VouchersSecuritiesComponent,
    VoucherSecurityComponent,
    VoucherSecurityEditComponent,
    VoucherSecurityAddListComponent,
    VoucherSecurityAutocompleteComponent,
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
    ReportsComponent,
    ReportComponent,
    ReportOperationsComponent,
    ReportOperationComponent,
    ReportOperationEditComponent,
    ReportRequestsComponent,
    ReportRequestComponent,
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
    VehicleAutocompleteComponent,
    ProductAndServicesComponent,
    ProductAndServiceComponent,
    ProductAndServiceEditComponent,
    ProductAndServiceSelectComponent,
    RatesComponent,
    RateComponent,
    RateEditComponent,
    RateAutocompleteComponent,
    DocumentsServicesOrdersComponent,
    DocumentServiceOrderComponent,
    DocumentServiceOrderEditComponent,
    ServiceOrdersComponent,
    ServiceOrderComponent,
    ServiceOrderEditComponent,
    ServiceOrderSelectComponent,
    ServiceOrderAutocompleteComponent,
    OriginDestinationsComponent,
    OriginDestinationComponent,
    OriginDestinationEditComponent,
    OriginDestinationSelectComponent,
    ClientBinnaclesComponent,
    ClientBinnacleComponent,
    ClientBinnacleEditComponent,
    NotificationsComponent,
    NotificationComponent,
    NotificationEditComponent,
    ToursDetailsComponent,
    TourDetailComponent,
    TourDetailEditComponent,
    PermissionsComponent,
    PermissionComponent,
    PermissionEditComponent,
    PermissionAutocompleteComponent,
    PermissionMultiselectComponent,
    GroupsComponent,
    GroupComponent,
    GroupEditComponent,
    GroupAutocompleteComponent,
    GroupMultiselectComponent,
    ContentTypesComponent,
    ContentTypeComponent,
    ContentTypeEditComponent,
    ContentTypeSelectComponent,
    ContentTypeAutocompleteComponent,
    ChestsComponent,
    ChestComponent,
    ChestEditComponent,
    TypesChestsComponent,
    TypeChestComponent,
    TypeChestEditComponent,
    TypeChestSelectComponent,
    ProductPartsComponent,
    ProductPartComponent,
    ProductPartEditComponent,
    TypesProductTransactionsComponent,
    TypeProductTransactionComponent,
    TypeProductTransactionEditComponent,
    TypeProductTransactionSelectComponent,
    StocksComponent,
    StockComponent,
    StockEditComponent,
    StockTransactionsComponent,
    StockTransactionComponent,
    StockTransactionEditComponent,
    StockTransactionDetailsComponent,
    StockTransactionDetailComponent,
    StockTransactionDetailEditComponent,
    StockTransactionAutocompleteComponent,
    StockSerialsComponent,
    StockSerialComponent,
    StockSerialEditComponent,
    HeadInvoicesComponent,
    HeadInvoiceComponent,
    HeadInvoiceEditComponent,
    HeadInvoiceAutocompleteComponent,
    InvoiceItemsComponent,
    InvoiceItemComponent,
    InvoiceItemEditComponent,
    TypesServiceOrdersComponent,
    TypeServiceOrderComponent,
    TypeServiceOrderEditComponent,
    TypeServiceOrderSelectComponent,
    PasswordsSettingsComponent,
    PasswordSettingComponent,
    PasswordSettingEditComponent,
    ChangePasswordComponent,
    InvoiceComponent,
    InvoicesComponent,
    InvoiceEditComponent, 
  ]
})
export class PagesModule { }
