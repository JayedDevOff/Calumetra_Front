import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Seo } from '../../../core/services/seo';

@Component({
  selector: 'app-paycheck',
  imports: [CommonModule, FormsModule],
  templateUrl: './paycheck.html',
  styleUrl: './paycheck.scss',
})
export class Paycheck {
  grossSalary = 5000;
  payFrequency = 'Monthly';
  currency = 'USD';

  federalTax = 10;
  stateTax = 5;
  socialSecurity = 6.2;
  medicare = 1.45;
  otherDeductions = 0;

  netPay = 0;
  totalDeductions = 0;
  calculated = false;

  currencies = [
    {
      code: 'USD',
      symbol: '$',
      name: 'US Dollar',
      locale: 'en-US',
    },
    {
      code: 'BDT',
      symbol: '৳',
      name: 'Bangladeshi Taka',
      locale: 'en-BD',
    },
    {
      code: 'EUR',
      symbol: '€',
      name: 'Euro',
      locale: 'de-DE',
    },
    {
      code: 'GBP',
      symbol: '£',
      name: 'British Pound',
      locale: 'en-GB',
    },
    {
      code: 'CAD',
      symbol: 'C$',
      name: 'Canadian Dollar',
      locale: 'en-CA',
    },
    {
      code: 'AUD',
      symbol: 'A$',
      name: 'Australian Dollar',
      locale: 'en-AU',
    },
    {
      code: 'JPY',
      symbol: '¥',
      name: 'Japanese Yen',
      locale: 'ja-JP',
    },
    {
      code: 'INR',
      symbol: '₹',
      name: 'Indian Rupee',
      locale: 'en-IN',
    },
    {
      code: 'SAR',
      symbol: '﷼',
      name: 'Saudi Riyal',
      locale: 'ar-SA',
    },
    {
      code: 'AED',
      symbol: 'د.إ',
      name: 'UAE Dirham',
      locale: 'en-AE',
    },
    {
      code: 'SGD',
      symbol: 'S$',
      name: 'Singapore Dollar',
      locale: 'en-SG',
    },
    {
      code: 'MYR',
      symbol: 'RM',
      name: 'Malaysian Ringgit',
      locale: 'ms-MY',
    },
    {
      code: 'NZD',
      symbol: 'NZ$',
      name: 'New Zealand Dollar',
      locale: 'en-NZ',
    },
    {
      code: 'CHF',
      symbol: 'CHF',
      name: 'Swiss Franc',
      locale: 'de-CH',
    },
    {
      code: 'CNY',
      symbol: '¥',
      name: 'Chinese Yuan',
      locale: 'zh-CN',
    },
  ];

  constructor(private seo: Seo) {
    this.seo.setSeo(
      'Paycheck Calculator - Calculate Take-Home Pay',
      'Use our free Paycheck Calculator to estimate your take-home pay after taxes and deductions. Calculate weekly, biweekly, monthly, or annual net pay with multiple currencies.',
      'https://calumetra.com/paycheck-calculator',
    );
  }

  get selectedCurrency() {
    return this.currencies.find((item) => item.code === this.currency) || this.currencies[0];
  }

  calculatePaycheck(): void {
    const gross = Number(this.grossSalary) || 0;

    const federal = (gross * (Number(this.federalTax) || 0)) / 100;

    const state = (gross * (Number(this.stateTax) || 0)) / 100;

    const social = (gross * (Number(this.socialSecurity) || 0)) / 100;

    const medicare = (gross * (Number(this.medicare) || 0)) / 100;

    const other = Number(this.otherDeductions) || 0;

    this.totalDeductions = federal + state + social + medicare + other;

    this.netPay = Math.max(0, gross - this.totalDeductions);

    this.calculated = true;
  }

  get netPercentage(): number {
    const gross = Number(this.grossSalary) || 0;

    if (!gross) {
      return 0;
    }

    return Math.min(100, (this.netPay / gross) * 100);
  }

  get deductionPercentage(): number {
    const gross = Number(this.grossSalary) || 0;

    if (!gross) {
      return 0;
    }

    return Math.min(100, (this.totalDeductions / gross) * 100);
  }

  get federalAmount(): number {
    const gross = Number(this.grossSalary) || 0;

    return (gross * (Number(this.federalTax) || 0)) / 100;
  }

  get stateAmount(): number {
    const gross = Number(this.grossSalary) || 0;

    return (gross * (Number(this.stateTax) || 0)) / 100;
  }

  get socialSecurityAmount(): number {
    const gross = Number(this.grossSalary) || 0;

    return (gross * (Number(this.socialSecurity) || 0)) / 100;
  }

  get medicareAmount(): number {
    const gross = Number(this.grossSalary) || 0;

    return (gross * (Number(this.medicare) || 0)) / 100;
  }

  formatCurrency(value: number): string {
    const selected = this.selectedCurrency;

    return new Intl.NumberFormat(selected.locale, {
      style: 'currency',
      currency: selected.code,
      minimumFractionDigits: selected.code === 'JPY' ? 0 : 2,
      maximumFractionDigits: selected.code === 'JPY' ? 0 : 2,
    }).format(Number(value) || 0);
  }
}
