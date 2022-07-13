import { CurrencyModel } from "../../currency/_models/currency.model";
import { DivisionModel } from "../../division/_models/division.model";
import { PackingModel } from "../../packing/_models/packing.model";
import { CertifiedCartModel } from "../../certified-cart/_models/certified-cart.model";
import { CrewModel } from "../../crew/_models/crew.model";

export class VoucherModel {
  id: number;
  code: string;
  amount: number;
  exchange_rate: string;
  count_packings: number;
  verificated: boolean;
  date_delivery: string;
  pickup_date: string;
  checkin_date: string;
  division: any;
  guides: any;
  cashier: any;
  certified_cart_code: string;
  contract: any;
  origin_destination: any;
  location_origin: any;
  location_destination: any;
  packings: any[];
  currency: any;
  crew: any;
  vouchers: any[];
  direct_operation: boolean;
  is_active: boolean;
  verified_oi: boolean;
  file_uploaded: string;
  updated_reason: string;
  created_at: string;
  updated_at: string;
}
