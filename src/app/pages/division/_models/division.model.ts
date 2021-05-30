import { EmployeeModel } from "../../employee/_models/employee.model";
import { OfficeModel } from "../../office/_models/office.model";
import { TypeDivisionModel } from "../../type-division/_models/type-division.model";

export class DivisionModel {
  id: number;
  name: string;
  description: string;
  office: any;
  type_division: any;
  schedule: string;
  employees: any[];
}
