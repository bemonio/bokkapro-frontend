import { SegmentCompanyModel } from "../../segment-company/_models/segment-company.model";
import { TypeCompanyModel } from "../../type-company/_models/type-company.model";
import { OfficeModel } from "../../office/_models/office.model";

export class CompanyModel {
  id: number;
  code: string;
  // code_brinks: string;
  identification_number: string;
  name: string;
  // alias: string;
  // abbreviation: string;
  logo: string;
  email: string;
  phone: string;
  web: string;
  address: string;
  name_invoce_to: string;
  // is_carrier: boolean;
  // is_financial_institution: boolean;
  // is_government_institution: boolean;
  // is_commercial_institution: boolean;
  is_active: boolean;
  // dubious_reputation: boolean;
  segment_company: any;
  type_company: any;
  office_belongs: any;
  created_at: string;
  updated_at: string;
}
