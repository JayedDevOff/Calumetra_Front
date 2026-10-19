import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CATEGORIES } from '../../../core/models/category.model';
import { CALCULATORS } from '../../../core/models/calculator.model';

interface Calculator {
  name: string;
  description: string;
  category: string;
  icon: string;
  iconBg: string;
  route: string;
  popular?: boolean;
}

interface Category {
  name: string;
  icon: string;
  count: number;
}

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.scss',
})
export class Dashboard implements OnInit {
  searchTerm: string = '';
  selectedCategory: string = 'All';

  popularCalculators: Calculator[] = [];
  filteredCalculators: Calculator[] = [];

  CATEGORIES: Category[] = CATEGORIES;
  calculators: Calculator[] = CALCULATORS;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.filteredCalculators = [...this.calculators];

    this.popularCalculators = this.calculators
      .filter((calculator) => calculator.popular)
      .slice(0, 4);
  }

  get availableCategories(): Category[] {
    return this.CATEGORIES.filter((category) => this.hasCalculators(category.name));
  }

  hasCalculators(categoryName: string): boolean {
    return this.calculators.some((calculator) => calculator.category === categoryName);
  }

  onSearch(): void {
    const search = this.searchTerm.trim().toLowerCase();

    this.filteredCalculators = this.calculators.filter((calculator) => {
      const matchesSearch =
        !search ||
        calculator.name.toLowerCase().includes(search) ||
        calculator.description.toLowerCase().includes(search) ||
        calculator.category.toLowerCase().includes(search);

      const matchesCategory =
        this.selectedCategory === 'All' || calculator.category === this.selectedCategory;

      return matchesSearch && matchesCategory;
    });
  }

  selectCategory(category: string): void {
    this.selectedCategory = category;

    this.onSearch();

    if (category !== 'All') {
      this.scrollToCalculators();
    }
  }

  clearSearch(): void {
    this.searchTerm = '';
    this.selectedCategory = 'All';
    this.filteredCalculators = [...this.calculators];
  }

  showAllCalculators(): void {
    this.selectedCategory = 'All';
    this.searchTerm = '';
    this.filteredCalculators = [...this.calculators];

    this.scrollToCalculators();
  }

  openCalculator(calculator: Calculator): void {
    if (!calculator.route) {
      return;
    }

    this.router.navigate([calculator.route]);
  }

  private scrollToCalculators(): void {
    setTimeout(() => {
      document.querySelector('.all-calculators')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 50);
  }
}
