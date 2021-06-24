import { EmployeeModel } from "../../employee/_models/employee.model";
import { DivisionModel } from "../../division/_models/division.model";
import { VehicleModel } from "../../vehicle/_models/vehicle.model";

export class CrewModel {
  id: number;
  division: any;
  date: string;
  driver: any;
  assistant: any;
  assistant2: any;
  vehicle: any;
}
