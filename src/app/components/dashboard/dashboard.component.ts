import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService, Order } from '../../services/order.service';
import { BookService} from '../../services/book.service';
import { Book } from '../../models/book.model';
@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  recentPurchases: Order[] = [];
  shipmentStatus: any[] = [];
  userOrders: Order[] = [];
  books: Book[] = [];

  constructor(private orderService: OrderService, private bookService: BookService) {}

  ngOnInit(): void {
    this.bookService.getBooks().subscribe(books => {
      this.books = books;
      this.loadOrders();
    });
    
    this.loadOrders();
    this.orderService.getOrders().subscribe({
      next: (orders) => (this.userOrders = orders),
      error: (err) => (this.userOrders = []),
    });
  }

  loadOrders(): void {
    this.orderService.getOrders().subscribe(
      (data: Order[]) => {
        const email = sessionStorage.getItem('userEmail');
        this.recentPurchases = data.filter((order) => order.id_User === email);
        console.log('Fetched orders:', this.recentPurchases);
      },
      (error) => {
        console.error('Error fetching orders', error);
      }
    );
  }

  getStatus(status: number) {
    switch (status) {
      case 1:
        return 'Pendiente';
      case 2:
        return 'Pagado';
      case 3:
        return 'Cancelado';

      case 4:
        return 'En preparación';
      case 5:
        return 'Enviado';
      case 6:
        return 'Recibido';
      default:
        return 'Preparando';
    }
  }

  getBookTitle(id_Book: number): string {
    return this.books.find(b => b.id_Book === id_Book)?.title || 'Libro desconocido';
  }
}
