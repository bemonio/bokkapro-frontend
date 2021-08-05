import { CompanyModel } from "../../company/_models/company.model";

export class NotificationModel {
  id: number;
  icon: string;
  title: string;
  description: string;
  link: string;
  is_read: boolean;
  type: string;
  module: string;
  employee_origin: any;
  employee_destination: any;
  created_at: string;
  updated_at: string;
}
