import { Author } from './author.model';
import { Editorial } from './editorial.model';
import { Genre } from './genre.model';

export interface Book {
  id_Book: number;
  title: string;
  id_Author: Author | null;
  id_Genre: Genre | null;
  description: string;
  price: number;
  stock: number;
  id_Editorial: Editorial | null;
  image: string;
  avg_rating?: number;
  quantity?: number;
  isBestSeller?: boolean;      
  isRecommended?: boolean;
  is_new?: boolean;
}
