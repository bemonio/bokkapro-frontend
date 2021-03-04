import { CurrencyModel } from "../../currency/_models/currency.model";

export class ExchangeModel {
  id: number;
  rate: number;
  date: Date;
  currency: any;
}