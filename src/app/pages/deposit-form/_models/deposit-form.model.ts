import { PackageModel } from "../../package/_models/package.model";
import { BankAccountModel } from "../../bank-account/_models/bank-account.model";
import { EmployeeModel } from "../../employee/_models/employee.model";

export class DepositFormModel {
  id: number;
  amount: string;
  difference_reason: string;
  verified: string;
  verified_at: string;
  packages: any;
  bank_account: any;
  employee_who_counts: any;
  supervisor: any;
}
