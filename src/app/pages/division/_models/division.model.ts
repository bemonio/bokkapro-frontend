import { EmployeeModel } from "../../employee/_models/employee.model";
import { OfficeModel } from "../../office/_models/office.model";

export class DivisionModel {
  id: number;
  name: string;
  description: string;
  office: any;
  employees: any[];
}
