import { DivisionModel } from "../../division/_models/division.model";
import { EmployeeModel } from "../../employee/_models/employee.model";
import { VoucherModel } from "../../voucher/_models/voucher.model";

export class GuideModel {
  id: number;
  description: string;
  status: string;
  am_pm: string;
  date: string;
  type_guide: number;
  division_origin: any;
  division_destination: any;
  employee_origin: any;
  employee_destination: any;
  vouchers: any[];
}
