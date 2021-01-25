import { DepartmentModel } from "../../department/_models/department.model";

export class PositionModel {
  id: number;
  name: string;
  description: string;
  department: any;
}
