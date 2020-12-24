import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';
type Severities = 'success' | 'info' | 'warn' | 'error';

@Injectable()
export class ToastService {
  growlChange: Subject<Object> = new Subject<Object>();

  growl(severity: Severities, summary: string, detail?: string, key?: string) {
    this.growlChange.next({ severity, summary, detail, key });
  }
}
