import { CompanyModel } from "../../company/_models/company.model";

export class ContractModel {
  id: number;
  code: string;
  company: any;
  type_contract: any;
  name_invoce_to: string;
  start_billing_date: string;
  end_billing_date: string;
  identification_number: number;
  email: string;
  phone: number;
  // web: string;
  // alias: string;
  // abbreviation: string;
  address: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
