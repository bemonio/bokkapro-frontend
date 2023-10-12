import { CompanyModel } from "../../company/_models/company.model";

export class InvoiceFormModel {
  id: number;
  contract: string;
  contract_id: number;
  company_code: string;
  currency: number;
  company_name: string;
  company_id: number;
  company_identification: string;
  invoice_description: string;
  invoice_number: string;
  invoice_date: number;
  date_service: string;
  due_date: string;
  expires_in: string;
  created_at: string;
  updated_at: string;
  quantity: string;
  amount: number;
  total: number;
  subtotal: number;
  deleted: number;
  discount: number;
  discount_amount: number;
  tax_rate: number;
  tax_amount: number;
}


