import { DepartmentModel } from "../../department/_models/department.model";
import { EmployeeModel } from "../../employee/_models/employee.model";

export class GuideModel {
  id: number;
  description: string;
  status: string;
  am_pm: string;
  date: string;
  department_origin: any;
  department_destination: any;
  employee_origin: any;
  employee_destination: any;
}
