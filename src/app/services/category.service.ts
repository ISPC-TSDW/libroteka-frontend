import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private selectedCategory = new BehaviorSubject<string>('todo');
  selectedCategory$ = this.selectedCategory.asObservable();

  setCategory(category: string) {
    this.selectedCategory.next(category.toLowerCase());
  }

  getCategory(): string {
    return this.selectedCategory.value;
  }
} 