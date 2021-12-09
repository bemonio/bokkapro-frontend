export class ServiceOrderModel {
  id: number;
  total_amount: string;
  status: string;
  note: string;
  total_fixed_costs: number;
  travels: number;
  travels_directs: number;
  appraisal: number;
  handling: number;
  materials: number;
  custody_cpv: number;
  custody_vault: number;
  pieces: number;
  company: any;
  employee: any;
  contract: any;
  company_contact: any;
  office: any;
  product_and_service: any;
}
