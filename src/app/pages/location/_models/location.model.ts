import { TypeLocationModel } from "../../type-location/_models/type-location.model";
import { CompanyModel } from "../../company/_models/company.model";
import { ZoneModel } from "../../zone/_models/zone.model";

export class LocationModel {
  id: number;
  code: string;
  code_brinks: string;
  name: string;
  contact: string;
  point_name: string;
  reference_point: string;
  telephone: string;
  email: string;
  address: string;
  description: string;
  type_location: any;
  company: any;
  zone: any;
  type_address: string
}
