import { SegmentCompanyModel } from "../../segment-company/_models/segment-company.model";
import { TypeCompanyModel } from "../../type-company/_models/type-company.model";
import { VoucherModel } from "../../voucher/_models/voucher.model";

export class PackingModel {
  id: number;
  code: string;
  verificated: boolean;
  voucher_current: any;
  vouchers: any[];
  created_at: string;
  updated_at: string;
}
