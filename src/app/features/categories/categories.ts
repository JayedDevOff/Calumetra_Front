import { Component } from '@angular/core';
import { CATEGORIES, Category } from '../../core/models/category.model';

@Component({
  selector: 'app-categories',
  imports: [],
  templateUrl: './categories.html',
  styleUrl: './categories.scss',
})
export class Categories {
  categories: Category[] = CATEGORIES;
}
