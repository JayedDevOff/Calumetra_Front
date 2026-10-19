import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CATEGORIES, Category } from '../../../core/models/category.model';
import { CALCULATORS } from '../../../core/models/calculator.model';

@Component({
  selector: 'app-header',
  imports: [CommonModule, RouterModule],
  templateUrl: './header.html',
  styleUrl: './header.scss',
})
export class Header {
  toolsOpen = false;
  mobileMenu = false;
  moreOpen = false;
  CATEGORIES: Category[] = CATEGORIES;
  calculators = CALCULATORS;

  hasCalculators(categoryName: string): boolean {
    return this.calculators.some((calculator) => calculator.category === categoryName);
  }

  openToolsOnHover(): void {
    this.toolsOpen = true;
  }

  closeToolsOnMouseLeave(): void {
    this.toolsOpen = false;
  }

  toggleMobileMenu(): void {
    this.mobileMenu = !this.mobileMenu;
  }

  toggleMore(): void {
    this.moreOpen = !this.moreOpen;
  }

  closeMenu(): void {
    this.toolsOpen = false;
    this.mobileMenu = false;
  }
}
