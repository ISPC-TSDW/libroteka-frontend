import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
//import { Book } from './cart.service';
import { Book } from '../models/book.model';
import { environment } from '../environment';

export interface Order {
  id_Order: number;
  id_User: string;
  id_Order_Status: number;
  date: Date;
  books: any;
  total: number;
  books_amount: number;
}

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  private apiUrl = `${environment.apiUrl}/api/orders/`;
  

  constructor(private http: HttpClient) {}

  createOrder(order: Partial<Order>): Observable<any> {
    return this.http.post(this.apiUrl, order);
  }

  getOrders(): Observable<Order[]> {
    return this.http.get<Order[]>(this.apiUrl).pipe(
      map(orders => orders.map(order => ({
        ...order,
        books: JSON.parse(order.books)
      })))
    );
  }

  createMercadoPagoPreference(items: any[]): Observable<any> {
  return this.http.post(`${environment.apiUrl}/api/mercadopago/preference/`, { items }, { withCredentials: true });
  }
}