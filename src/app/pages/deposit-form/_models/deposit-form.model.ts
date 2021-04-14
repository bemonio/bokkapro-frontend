import { CompanyModel } from "../../company/_models/company.model";

export class DepositFormModel {
  id: number;
  amount: number;
  difference_reason: number;
  verified: boolean;
  verified_at: string;
  packing: any;
  bank_account: any;
  employee_who_counts: any;
  supervisor: any;
  created_at: string;
  updated_at: string;
}


