export class ReportOperationModel {
  id: number;
  closed_at: string;
  hours_close: string;
  atm: number;
  atm_transit: number;
  packings_pending: number;
  packings_pending_amount: number;
  cash_opening: number;
  employees_close: any[];
  employees_open: any[];
  created_at: string;
  updated_at: string;
}
