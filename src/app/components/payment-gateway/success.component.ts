import { Component, OnInit, Inject } from '@angular/core';
import { OrderService } from '../../services/order.service';
import { CartService } from '../../services/cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  // styleUrls: ['./success.component.css']
})
export class SuccessComponent implements OnInit {
  cartItems: any[] = [];
  addressDetails: any = {};
  totalAmount: number = 0;

  constructor(
    private orderService: OrderService,
    private cartService: CartService,
    private router: Router
  ) {}

  ngOnInit() {
    // Recupera los datos del carrito y envío (puedes guardarlos en localStorage antes de abrir MP)
    this.cartItems = JSON.parse(localStorage.getItem('cartItems') || '[]');
    this.addressDetails = JSON.parse(localStorage.getItem('addressDetails') || '{}');
    this.totalAmount = Number(localStorage.getItem('totalAmount') || 0);

    const orderData = {
      id_Order_Status: 2, // Pagada
      books: this.cartItems,
      total: this.totalAmount,
      books_amount: this.cartItems.reduce((acc: number, item: any) => acc + (item.quantity || 1), 0),
      address: this.addressDetails.address,
      city: this.addressDetails.city,
      telephone: this.addressDetails.telephone,
      preference_id: localStorage.getItem('preferenceId') || ''
    };

    this.orderService.createOrder(orderData).subscribe({
      next: res => {
        this.cartService.clearCart();
        // Limpia localStorage si lo usaste
        localStorage.removeItem('cartItems');
        localStorage.removeItem('addressDetails');
        localStorage.removeItem('totalAmount');
        localStorage.removeItem('preferenceId');
        this.router.navigate(['/dashboard']);
      },
      error: err => {
        alert('Error al registrar la orden pagada');
      }
    });
  }

  onMercadoPagoPay() {
    // ...código para abrir MP...
    localStorage.setItem('cartItems', JSON.stringify(this.cartItems));
    localStorage.setItem('addressDetails', JSON.stringify(this.addressDetails));
    localStorage.setItem('totalAmount', this.totalAmount.toString());
    // ...abrir MP...
  }
}