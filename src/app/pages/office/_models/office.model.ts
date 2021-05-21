import { CompanyModel } from "../../company/_models/company.model";
import { CurrencyModel } from "../../currency/_models/currency.model";

export class OfficeModel {
  id: number;
  name: string;
  description: string;
  address: string
  phone: string
  email: string
  company: any;
  currency: any;
}
