import { Component, OnDestroy } from '@angular/core';
import { Book } from '../../models/book.model';
import { BusquedaService } from '../../services/busqueda.service';
import { Observable, Subject } from 'rxjs';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, FormsModule } from '@angular/forms';
import { takeUntil } from 'rxjs/operators';
import { BookDetailsComponent } from '../book-details/book-details.component';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-busqueda-personalizada',
  templateUrl: './busqueda-personalizada.component.html',
  styleUrls: ['./busqueda-personalizada.component.css'],
  standalone: true,
  imports:[BookDetailsComponent, CommonModule, ReactiveFormsModule, FormsModule]

})
export class BusquedaPersonalizadaComponent implements OnDestroy {
  searchResults: Book[] = [];
  form: FormGroup;
  hasSearched = false;
  selectedBook: Book | null = null;
  isPopupVisible = false; // Controla la visibilidad del popup
  private destroy$ = new Subject<void>();

  constructor(
    private busquedaService: BusquedaService,
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.form = this.formBuilder.group({
      value: ['', [Validators.required]],
      criterio: ['', [Validators.required]]
    });
  }

  get Value() {
    return this.form.get('value');
  }

  get Criterio() {
    return this.form.get('criterio');
  }

  performSearch() {
    if (this.form.invalid) {
      return;
    }

    const { criterio, value } = this.form.value;
    let observable$: Observable<Book[]>;

    switch (criterio) {
      case 'author':
        observable$ = this.busquedaService.getBooksByAuthor(value);
        break;
      case 'title':
        observable$ = this.busquedaService.getBooksByTitle(value);
        break;
      case 'genre':
        observable$ = this.busquedaService.getBooksByGenre(value);
        break;
      case 'editorial':
        observable$ = this.busquedaService.getBooksByEditorial(value);
        break;
      default:
        return;
    }

    observable$.pipe(takeUntil(this.destroy$)).subscribe({
      next: results => {
        this.searchResults = results;
        this.hasSearched = true;
      },
      error: error => {
        console.error('Error performing search:', error);
        alert('Error al realizar la búsqueda. Por favor, inténtelo de nuevo más tarde.');
        
      }
    });
  }

  onEnviar(event: any) {
    event.preventDefault(); // Evita el comportamiento predeterminado del formulario
    this.performSearch();
  }

  selectBook(book: Book) {
    this.selectedBook = book;
    this.isPopupVisible = true;
  }
  
  closePopup() {
    this.isPopupVisible = false; // Oculta el popup
    this.selectedBook = null; // Limpia el libro seleccionado
  }

  trackByBookId(index: number, book: Book) {
    return book.id_Book;
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
