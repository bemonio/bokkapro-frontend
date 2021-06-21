import { CurrencyModel } from "../../currency/_models/currency.model";
import { DivisionModel } from "../../division/_models/division.model";
import { PackingModel } from "../../packing/_models/packing.model";

export class VoucherModel {
  id: number;
  code: string;
  amount: number;
  count_packings: number;
  verificated: boolean;
  division: any;
  guides: any;
  company: any;
  cashier: any;
  location_origin: any;
  location_destination: any;
  packings: any[];
  currency: any;
  vouchers: any[];
  direct_operation: boolean;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
