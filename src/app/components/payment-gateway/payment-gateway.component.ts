import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterLink, Router } from '@angular/router';
import { CartService } from '../../services/cart.service';
import { Book } from '../../models/book.model';
import { OrderService, Order } from '../../services/order.service';
import { AuthService } from '../../services/auth.service';
import { environment } from '../../environment';
import { AuthorService, Author } from '../../services/author.service'; // Asegúrate de tener este servicio


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
  paymentMessage: string = '';
  paymentSuccess: boolean = false;
  authors: Author[] = [];

  constructor(
    private router: Router,
    private cartService: CartService,
    private orderService: OrderService,
    private authService: AuthService,
    private authorService: AuthorService
  ) { }

  ngOnInit(): void {
    this.cartService.cartItems$.subscribe(cartItems => {
      this.cartItems = cartItems;
      this.totalAmount = this.calculateTotal();
    });

    this.authorService.getAuthors().subscribe(authors => {
      this.authors = authors;
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
    return Math.round((this.cartItems.reduce((total, item) => total + (item.price * (item.quantity || 1)), 0)) * 100) / 100;
  }

  onAddressSubmit(form: any) {
    if (!form.valid){
      return;
    }
    this.showPaymentForm = true;
  }

  onPaymentSubmit() {
    const orderData = {
      books: this.cartItems,
      total: Math.round(this.totalAmount * 100) / 100,
      books_amount: this.cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0),
      address: this.addressDetails.address,
      city: this.addressDetails.city,
      telephone: this.addressDetails.telephone,
      dni: this.paymentDetails.dni,
      id_User: this.userEmail,
      id_Order_Status: 1};
    this.orderService.createOrder(orderData).subscribe({
      next: res => {
        this.paymentMessage = '¡Pago realizado con éxito!';
        this.paymentSuccess = true;
        this.cartService.clearCart();
        this.router.navigate(['/dashboard']);
      },
      error: err => {
        this.paymentMessage = 'Ocurrió un error al procesar el pago.';
        this.paymentSuccess = false;
      }
    });
  }

  onMercadoPagoPay() {
    const items = this.cartItems.map(item => ({
      title: item.title,
      quantity: item.quantity || 1,
      currency_id: 'ARS',
      unit_price: Math.round(item.price * 100) / 100
    }));

    const payload = {
      items,
      books: this.cartItems,
      total: Math.round(this.totalAmount * 100) / 100,
      books_amount: this.cartItems.reduce((acc, item) => acc + (item.quantity || 1), 0),
      address: this.addressDetails.address,
      city: this.addressDetails.city,
      telephone: this.addressDetails.telephone,
      dni: this.paymentDetails.dni,
      id_User: this.userEmail,
      id_Order_Status: 1
    };

    this.orderService.createMercadoPagoPreference(payload).subscribe(res => {
      const preferenceId = res.preference_id;
      this.mp.checkout({
        preference: { id: preferenceId },
        autoOpen: true,
        render: { container: '.cho-container', label: 'Pagar con Mercado Pago' }
      });
    });
  }

  cleanNumberField(field: keyof typeof this.paymentDetails) {
    this.paymentDetails[field] = this.paymentDetails[field].replace(/[^0-9]/g, '');
  }
  cleanAddressNumberField(field: keyof typeof this.addressDetails) {
    this.addressDetails[field] = this.addressDetails[field].replace(/[^0-9]/g, '');
  }
  cleanLetterField(field: keyof typeof this.paymentDetails) {
    this.paymentDetails[field] = this.paymentDetails[field].replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ ]/g, '');
  }
  cleanCityField() {
    this.addressDetails.city = this.addressDetails.city.replace(/[^a-zA-ZáéíóúÁÉÍÓÚñÑ ]/g, '');
  }
  formatExpiryDate() {
    let value = this.paymentDetails.expiryDate.replace(/[^0-9]/g, '');
    if (value.length > 2) {
      value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    this.paymentDetails.expiryDate = value.slice(0, 5);
  }

  getAuthorName(author: Author | number | null): string {
    if (!author) return 'Autor desconocido';
    if (typeof author === 'object' && 'name' in author) return author.name;
    return this.authors.find(a => a.id_Author === author)?.name || 'Autor desconocido';
  }
}
