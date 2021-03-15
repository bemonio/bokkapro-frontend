import { DepositFormModel } from "../../deposit-form/_models/deposit-form.model";
import { CurrencyDetailModel } from "../../currency-detail/_models/currency-detail.model";

export class DepositFormDetailModel {
  id: number;
  quantity: string;
  counted_quantity: string;
  deposit_form: any;
  currency_detail: any;
}
