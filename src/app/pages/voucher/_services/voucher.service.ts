import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of, Subscription } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { catchError, finalize, tap } from 'rxjs/operators';

@Injectable()
export class VoucherService {
    API_URL = `${environment.apiUrl}vouchers`;
    API_URL_ASIGN_CASHIER = `${environment.apiUrl}asigncashier`;
    API_URL_ASIGN_CERTIFIED_CART = `${environment.apiUrl}asigncertifiedcart`;
    API_URL_POST_LIST = `${environment.apiUrl}postlistvouchers`;
    // private _subscriptions: Subscription[] = [];

    constructor(public http: HttpClient) { }

    // get subscriptions() {
    //     return this._subscriptions;
    // }
    
    public get (page?: number, per_page?: number, sort?: string, query?: string, filters?: any[], _with?: any[]): Observable<any> {
        let params: URLSearchParams = new URLSearchParams();

        if (page !== null && page !== undefined) {
            params.append('_page', String(page));
        } else {
            params.append('_page', '1');
        }

        if (per_page !== null && per_page !== undefined) {
            params.append('_per_page', String(per_page));
        } else {
            params.append('_per_page', '10');
        }

        if (sort !== null && sort !== undefined) {
            params.append('sort[]', String(sort));
        }

        if (query !== null && query !== undefined && query !== '') {
            params.append(`filter`, String(query));
        }

        if (filters !== null && filters !== undefined && filters.length > 0) {
            filters.forEach(element => {
                params.append(element.key, String(element.value));
            });
        }

        if (_with !== null && _with !== undefined && _with.length > 0) {
            _with.forEach(element => {
                params.append(element.key, String(element.value));
            });
        }

        return this.http.get(`${this.API_URL}?${params}&include[]=division.*`);
    }

    public post(body: Object): Observable<any> {
        return this.http.post(`${this.API_URL}`, JSON.stringify(body));
    }

    public patch(id: number, body: Object): Observable<any> {
        return this.http.patch(`${this.API_URL}/${id}`, JSON.stringify(body));
    }

    public delete(id: number): Observable<any> {
        return this.http.delete(`${this.API_URL}/${id}`);
    }

    public getById(id: number): Observable<any> {
        return this.http.get(`${this.API_URL}/${id}/?include[]=company.*&include[]=packings.*&include[]=division.*&include[]=currency.office.*&include[]=cashier.*&include[]=contract.*&include[]=origin_destination.origin.*&include[]=origin_destination.destination.*`);
    }

    public asignCashier(body: Object): Observable<any> {
        return this.http.post(`${this.API_URL_ASIGN_CASHIER}`, JSON.stringify(body));
    }

    public asignCertifiedCart(body: Object): Observable<any> {
        return this.http.post(`${this.API_URL_ASIGN_CERTIFIED_CART}`, JSON.stringify(body));
    }

    public postList(body: Object): Observable<any> {
        return this.http.post(`${this.API_URL_POST_LIST}`, JSON.stringify(body));
    }
}
