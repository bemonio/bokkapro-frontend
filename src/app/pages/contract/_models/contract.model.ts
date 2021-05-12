import { CompanyModel } from "../../company/_models/company.model";

export class ContractModel {
  id: number;
  code: string;
  company: any;
  type_contract: any;
  created_at: string;
  updated_at: string;
}
