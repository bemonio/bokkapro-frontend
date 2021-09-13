import { OriginDestinationModel } from "../../origin-destination/_models/origin-destination.model";
import { DivisionModel } from "../../division/_models/division.model";

export class TourDetailModel {
  id: number;
  origin_destination: any;
  division: any;
  date_start: string;
  date_end: string;
}
