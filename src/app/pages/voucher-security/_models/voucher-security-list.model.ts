import { CurrencyModel } from "../../currency/_models/currency.model";
import { DivisionModel } from "../../division/_models/division.model";
import { PackingModel } from "../../packing/_models/packing.model";
import { CertifiedCartModel } from "../../certified-cart/_models/certified-cart.model";
import { CrewModel } from "../../crew/_models/crew.model";

export class VoucherSecurityListModel {
  id: number;
  code_start: string;
  code_end: string;
  verificated: boolean;
  division: any;
  contract: any;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
