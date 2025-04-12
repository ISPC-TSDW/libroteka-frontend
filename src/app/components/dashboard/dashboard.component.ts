import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderService, Order } from '../../services/order.service';

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

  constructor(private orderService: OrderService) {}

  ngOnInit(): void {
    this.loadOrders();
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
      case 4:
        return 'Preparando';
      case 5:
        return 'Enviado';
      case 6:
        return 'Recibido';
      default:
        return 'Preparando';
    }
  }
}
