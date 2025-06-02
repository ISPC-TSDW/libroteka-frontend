import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { Book } from '../../models/book.model';
import { OrderService, Order } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../environment';

declare var MercadoPago: any;

@Component({
  selector: 'app-payment-gateway',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './payment-gateway.component.html',
  styleUrls: ['./payment-gateway.component.css']
})
export class PaymentGatewayComponent implements OnInit {
  userEmail: string = '';

  addressDetails = {
    city: '',
    address: '',
    telephone: ''
  };

  paymentDetails = {
    cardNumber: '',
    expiryDate: '',
    cvv: '',
    cardHolderName: '',
    dni: ''
  };

  cartItems: Book[] = [];
  totalAmount: number = 0;
  showPaymentForm: boolean = false;
  mp: any;

  constructor(private router: Router, private cartService: CartService, private orderService: OrderService, private authService: AuthService) { }

  ngOnInit(): void {
    this.cartService.cartItems$.subscribe(cartItems => {
      this.cartItems = cartItems;
      this.totalAmount = this.calculateTotal();
    });
    this.authService.getCurrentUser().subscribe({
      next: user => this.userEmail = user.email,
      error: err => {
        console.error('Error fetching user:', err);
      }
    });

     this.mp = new MercadoPago(environment.mercadoPagoPublicKey, { locale: 'es-AR' });
  }

  calculateTotal(): number {
    return this.cartItems.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0);
  }

  onAddressSubmit(form: any) {
    if (!form.valid){
      return;
    }
    this.showPaymentForm = true;
  }

  onPaymentSubmit() {
    if (!this.userEmail) {
      console.error('Email is null, order not created');
      alert('Error: no se detectó el usuario.');
      return;
    }

    const validCart = this.cartItems.map(({ quantity, ...props }) => props);
    const orderData = {
      //id_User: this.userEmail, // debe existir en UsersLibroteka
      id_Order_Status: 1, // ID de "Pendiente", por ejemplo
      //date: new Date(),
      books: validCart, 
      total: this.totalAmount,
      books_amount: this.cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0),
      address: this.addressDetails.address,
      city: this.addressDetails.city,
      telephone: this.addressDetails.telephone,
      dni: this.paymentDetails.dni,
    };

  console.log("Order payload:", orderData);

  this.orderService.createOrder(orderData).subscribe({
    next: res => {
      console.log('Order created successfully:', res);
      this.cartService.clearCart();
      this.router.navigate(['/dashboard']);
    },
    error: err => {
      console.error('Error creating order:', err);
      alert('Error al crear la orden');
    }
  });
}


onMercadoPagoPay() {
  const items = this.cartItems.map(item => ({
    title: item.title,
    quantity: item.quantity || 1,
    currency_id: "ARS",
    unit_price: item.price
  }));
  this.orderService.createMercadoPagoPreference(items).subscribe((res: any) => {
    this.mp.checkout({
      preference: { id: res.preference_id },
      autoOpen: true,
      render: {
        container: '.cho-container',
        label: 'Pagar con Mercado Pago'
      }
    });
  }, error => {
    alert('Error al iniciar el pago con Mercado Pago');
    console.error(error);
  });
}

  
}
