export class HeadInvoiceModel {
  id: number;
  invoice_number : number;
  exchange_rate : number; 
  tax_rate : number; 
  total_tax_amount : number;
  tax_exempt : boolean;
  total_disccount : number;
  created_at : string;
  updated_at : string;
  from_date : string;
  to_date : string;
  due_date : string;
  total_amount : number;
  fuel_charge : number;
  total_fuel_charge : number;
  total_travels : number;
  total_travels_directs : number;
  total_appraisal : number;
  total_handling : number; 
  total_materials : number;
  total_custody_cpv : number;
  total_custody_vault : number;
  total_custody_personal_atm : number;
  total_pieces : number;
  total_fixed_costs_packing : number;
  total_vigilant : number;
  total_atm_supply : number;
  total_atm_failure_1_2_levels : number;

  serviceorder : any;
  employee : any;
  contract : any;
  company_contact : any;
  office : any;
  type_service_order : any;
  currency : any;
}