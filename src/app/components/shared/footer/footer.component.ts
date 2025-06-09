import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, Router } from '@angular/router';
import { CategoryService } from '../../../services/category.service';
import { GenreService, Genre } from '../../../services/genre.service';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './footer.component.html',
  styleUrls: ['./footer.component.css']
})
export class FooterComponent implements OnInit {
  genres: Genre[] = [];
  showAllGenres: boolean = false;
  readonly INITIAL_GENRES_COUNT = 5;

  constructor(
    private categoryService: CategoryService,
    private genreService: GenreService,
    private router: Router
  ) {}

  ngOnInit() {
    this.loadGenres();
  }

  loadGenres() {
    this.genreService.getGenres().subscribe({
      next: (genres) => {
        this.genres = genres;
      },
      error: (error) => {
        console.error('Error al cargar los géneros:', error);
      }
    });
  }

  navigateToCategory(category: string) {
    this.categoryService.setCategory(category);
    this.router.navigate(['/catalogo']);
  }

  toggleGenres() {
    this.showAllGenres = !this.showAllGenres;
  }

  get visibleGenres(): Genre[] {
    return this.showAllGenres ? this.genres : this.genres.slice(0, this.INITIAL_GENRES_COUNT);
  }

  get hasMoreGenres(): boolean {
    return this.genres.length > this.INITIAL_GENRES_COUNT;
  }
}