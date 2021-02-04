import { PackageModel } from "../../package/_models/package.model";

export class VoucherModel {
  id: number;
  code: string;
  amount: number;
  count_packages: number;
  verificated: boolean;
  guide: any;
  company: any;
  location_origin: any;
  location_destination: any;
  packages: any[];
  created_at: string;
  updated_at: string;
}
