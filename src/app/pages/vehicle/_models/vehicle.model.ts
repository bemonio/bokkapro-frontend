import { OfficeModel } from "../../office/_models/office.model";

export class VehicleModel {
  id: number;
  code: string;
  plate: string;
  amount_insured: number;
  is_armored: boolean;
  office: any;
  created_at: string;
  updated_at: string;
}
