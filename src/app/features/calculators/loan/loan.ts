import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-loan',
  imports: [CommonModule, FormsModule],
  templateUrl: './loan.html',
  styleUrl: './loan.scss',
})
export class Loan {
  loanAmount = 25000;
  interestRate = 6.5;
  loanTerm = 5;
  termType: 'years' | 'months' = 'years';
  currency = 'USD';

  currencies = [
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'BDT', name: 'Bangladeshi Taka', symbol: '৳' },
    { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
    { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ' },
    { code: 'SAR', name: 'Saudi Riyal', symbol: '﷼' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
  ];

  get selectedCurrency() {
    return this.currencies.find((c) => c.code === this.currency) || this.currencies[0];
  }

  get totalMonths(): number {
    return this.termType === 'years'
      ? Math.max(1, Math.round(this.loanTerm * 12))
      : Math.max(1, Math.round(this.loanTerm));
  }

  get monthlyRate(): number {
    return Math.max(0, this.interestRate) / 100 / 12;
  }

  get monthlyPayment(): number {
    const principal = Math.max(0, Number(this.loanAmount) || 0);
    const rate = this.monthlyRate;
    const months = this.totalMonths;

    if (!principal || !months) {
      return 0;
    }

    if (rate === 0) {
      return principal / months;
    }

    return (principal * (rate * Math.pow(1 + rate, months))) / (Math.pow(1 + rate, months) - 1);
  }

  get totalPayment(): number {
    return this.monthlyPayment * this.totalMonths;
  }

  get totalInterest(): number {
    return Math.max(0, this.totalPayment - Number(this.loanAmount || 0));
  }

  get principalPercentage(): number {
    if (!this.totalPayment) {
      return 0;
    }

    return (Number(this.loanAmount || 0) / this.totalPayment) * 100;
  }

  get interestPercentage(): number {
    if (!this.totalPayment) {
      return 0;
    }

    return (this.totalInterest / this.totalPayment) * 100;
  }

  get formattedTerm(): string {
    if (this.termType === 'years') {
      return `${this.loanTerm} ${Number(this.loanTerm) === 1 ? 'Year' : 'Years'}`;
    }

    return `${this.loanTerm} ${Number(this.loanTerm) === 1 ? 'Month' : 'Months'}`;
  }

  get currencySymbol(): string {
    return this.selectedCurrency.symbol;
  }

  formatMoney(value: number): string {
    const currency = this.currency;

    try {
      return new Intl.NumberFormat(undefined, {
        style: 'currency',
        currency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value || 0);
    } catch {
      return `${this.currencySymbol}${(value || 0).toFixed(2)}`;
    }
  }

  calculate(): void {
    this.loanAmount = Math.max(0, Number(this.loanAmount) || 0);
    this.interestRate = Math.max(0, Number(this.interestRate) || 0);
    this.loanTerm = Math.max(1, Number(this.loanTerm) || 1);
  }

  reset(): void {
    this.loanAmount = 25000;
    this.interestRate = 6.5;
    this.loanTerm = 5;
    this.termType = 'years';
    this.currency = 'USD';
  }

  get schedule() {
    const rows: {
      month: number;
      payment: number;
      principal: number;
      interest: number;
      balance: number;
    }[] = [];

    let balance = Number(this.loanAmount) || 0;
    const rate = this.monthlyRate;
    const payment = this.monthlyPayment;

    for (let month = 1; month <= Math.min(this.totalMonths, 12); month++) {
      const interest = balance * rate;
      let principal = payment - interest;

      if (month === this.totalMonths) {
        principal = balance;
      }

      const actualPayment = principal + interest;
      balance = Math.max(0, balance - principal);

      rows.push({
        month,
        payment: actualPayment,
        principal,
        interest,
        balance,
      });
    }

    return rows;
  }
}
