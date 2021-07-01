import { CompanyModel } from "../../company/_models/company.model";

export class ContractModel {
  id: number;
  code: string;
  company: any;
  type_contract: any;
  start_billing_date: string;
  end_billing_date: string;
  created_at: string;
  updated_at: string;
}
