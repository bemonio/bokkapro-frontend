import { DepartmentModel } from "../../department/_models/department.model";
import { EmployeeModel } from "../../employee/_models/employee.model";
import { VoucherModel } from "../../voucher/_models/voucher.model";

export class GuideModel {
  id: number;
  description: string;
  status: string;
  am_pm: string;
  date: string;
  type_guide: number;
  department_origin: any;
  department_destination: any;
  employee_origin: any;
  employee_destination: any;
  vouchers: any[];
}
