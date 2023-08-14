import { CompanyModel } from "../../company/_models/company.model";

export class DepositFormModel {
  id: number;
  amount: number;
  contain: number;
  difference_amount: string;
  bank: string;
  bank_account_number: string;
  form_number:string;
  review: string;
  verified: boolean;
  verified_at: string;
  packing: any;
  currency: any;
  bank_account: any;
  employee_who_counts: any;
  supervisor: any;
  supervisor_extra: any;
  created_at: string;
  updated_at: string;
  deposit_form_details: any;
  deposit_form_detail_currency_details: any;
  selected_currencies: any;
  depositdetail_depositform: any; //only for receive backend
  difference: any;
}


