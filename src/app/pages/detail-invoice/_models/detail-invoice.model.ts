export class DetailInvoiceModel {

  id : number;
  created_at : string;
  updated_at : string;
  details : string;
  details2 : string;
  signo : boolean;
  vaultinc : boolean;
  quantity : number;
  quantity2 : number;
  total_amount : number;
  tax_exempt : boolean;
  disccount : number;
  
  head_invoice : any;
}