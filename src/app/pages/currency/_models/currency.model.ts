import { OfficeModel } from "../../office/_models/office.model";

export class CurrencyModel {
  id: number;
  code: string;
  symbol: string;
  name: string;
  format: string;
  exchange_rate: number;
  office: any;
}
