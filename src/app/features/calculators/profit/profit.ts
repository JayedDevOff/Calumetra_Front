import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Seo } from '../../../core/services/seo';

@Component({
  selector: 'app-profit',
  imports: [CommonModule, FormsModule],
  templateUrl: './profit.html',
  styleUrl: './profit.scss',
})
export class Profit {
  revenue: number = 0;
  costOfGoods: number = 0;
  operatingExpenses: number = 0;

  currency: string = 'USD';
  currencySymbol: string = '$';

  grossProfit: number = 0;
  totalCosts: number = 0;
  netProfit: number = 0;

  grossMargin: number = 0;
  profitMargin: number = 0;
  markup: number = 0;

  constructor(private seo: Seo) {}

  ngOnInit(): void {
    this.updateCurrencySymbol();
    this.calculate();
    this.seo.setPage('profitCalculator');
  }

  calculate(): void {
    this.revenue = this.toNumber(this.revenue);
    this.costOfGoods = this.toNumber(this.costOfGoods);
    this.operatingExpenses = this.toNumber(this.operatingExpenses);

    this.updateCurrencySymbol();

    this.totalCosts = this.costOfGoods + this.operatingExpenses;

    this.grossProfit = this.revenue - this.costOfGoods;

    this.netProfit = this.revenue - this.totalCosts;

    this.grossMargin = this.revenue > 0 ? (this.grossProfit / this.revenue) * 100 : 0;

    this.profitMargin = this.revenue > 0 ? (this.netProfit / this.revenue) * 100 : 0;

    this.markup = this.costOfGoods > 0 ? (this.grossProfit / this.costOfGoods) * 100 : 0;
  }

  updateCurrencySymbol(): void {
    const symbols: { [key: string]: string } = {
      USD: '$',
      EUR: '€',
      GBP: '£',
      BDT: '৳',
      INR: '₹',
      CAD: 'C$',
      AUD: 'A$',
      JPY: '¥',
    };

    this.currencySymbol = symbols[this.currency] || '$';
  }

  setExample(revenue: number, cost: number, expenses: number): void {
    this.revenue = revenue;
    this.costOfGoods = cost;
    this.operatingExpenses = expenses;

    this.calculate();
  }

  clearCalculator(): void {
    this.revenue = 0;
    this.costOfGoods = 0;
    this.operatingExpenses = 0;

    this.grossProfit = 0;
    this.totalCosts = 0;
    this.netProfit = 0;

    this.grossMargin = 0;
    this.profitMargin = 0;
    this.markup = 0;

    this.calculate();
  }

  formatNumber(value: number): string {
    if (!Number.isFinite(value)) {
      return '0.00';
    }

    return value.toLocaleString('en-US', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    });
  }

  private toNumber(value: number): number {
    const numberValue = Number(value);

    if (!Number.isFinite(numberValue) || numberValue < 0) {
      return 0;
    }

    return numberValue;
  }
}
