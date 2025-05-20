import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Book } from '../../models/book.model';
import { ActivatedRoute } from '@angular/router';


@Component({
  selector: 'app-book-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './book-details.component.html',
  styleUrl: './book-details.component.css'
})
export class BookDetailsComponent {
  
  @Input() selectedBook: Book | null = null;
  
  closePopup() {
    this.selectedBook = null;
  }
  
}
