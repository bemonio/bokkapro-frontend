import { CompanyModel } from "../../company/_models/company.model";

export class RateModel {
  id: number;
  code: string;
  frequency: string;
  trips_per_month: string;
  fixed_charge: string;
  limit_travel: string;
  limit_appraisal: string;
  limit_manipulation: string;
  limit_materials: string;
  excess_travel: string;
  excess_appraisal: string;
  excess_manipulation: string;
  excess_materials: string;
  office: any;
  product_and_service: any;
  created_at: string;
  updated_at: string;
}
