import { VoucherModel } from "../../voucher/_models/voucher.model";

export class CertifiedCartModel {
  id: number;
  code: string;
  verificated: boolean;
  vouchers: any[];
}
