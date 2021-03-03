import { CurrencyModel } from "../../currency/_models/currency.model";
import { DivisionModel } from "../../division/_models/division.model";
import { PackageModel } from "../../package/_models/package.model";

export class VoucherModel {
  id: number;
  code: string;
  amount: number;
  count_packages: number;
  verificated: boolean;
  division: any;
  guides: any;
  company: any;
  location_origin: any;
  location_destination: any;
  packages: any[];
  currency: any;
  created_at: string;
  updated_at: string;
}
