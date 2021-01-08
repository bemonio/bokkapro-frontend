import { TypeLocationModel } from "../../type-location/_models/type-location.model";
import { CompanyModel } from "../../company/_models/company.model";
import { ZoneModel } from "../../zone/_models/zone.model";

export class LocationModel {
  id: number;
  code: string;
  code_brinks: string;
  name: string;
  description: string;
  type_location: any;
  company: any;
  zone: any;
}
