import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Book } from '../models/book.model';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  private cartItems: Book[] = [];
  private cartItemsSubject = new BehaviorSubject<Book[]>([]);

  cartItems$ = this.cartItemsSubject.asObservable();

  constructor() {
    this.loadCartItems();
  }

  private loadCartItems(): void {
    const storedItems = localStorage.getItem('cartItems');
    this.cartItems = storedItems ? JSON.parse(storedItems) : [];
    this.cartItemsSubject.next(this.cartItems);
  }

  private saveCartItems(): void {
    localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
    this.cartItemsSubject.next(this.cartItems);
  }

  getCartItems(): Book[] {
    return this.cartItems;
  }

  addCartItem(book: Book): void {
    const existingItem = this.cartItems.find(item => item.id_Book === book.id_Book);
    if (existingItem) {
      existingItem.quantity = (existingItem.quantity ?? 1) + 1;
    } else {
      this.cartItems.push({ ...book, quantity: 1 });
    }
    this.saveCartItems();
  }

  removeCartItem(id_Book: number): void {
    this.cartItems = this.cartItems.filter(item => item.id_Book !== id_Book);
    this.saveCartItems();
  }

  clearCart(): void {
    this.cartItems = [];
    this.saveCartItems();
  }
}

