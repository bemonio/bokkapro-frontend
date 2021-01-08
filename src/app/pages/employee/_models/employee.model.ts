import { PositionModel } from "../../position/_models/position.model";
import { UserModel } from "../../user/_models/user.model";

export class EmployeeModel {
  id: number;
  name: string;
  description: string;
  position: any;
  user: any;
}
