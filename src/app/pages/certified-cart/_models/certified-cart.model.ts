import { VoucherModel } from "../../voucher/_models/voucher.model";

export class CertifiedCartModel {
  id: number;
  code: string;
  verificated: boolean;
  division: any;
  division_last: any;
  vouchers: any[];
}
