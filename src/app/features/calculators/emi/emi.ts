import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
interface Currency {
  code: string;
  name: string;
  symbol: string;
  locale: string;
}

interface AmortizationRow {
  payment: number;
  principal: number;
  interest: number;
  emi: number;
  balance: number;
}

@Component({
  selector: 'app-emi',
  imports: [CommonModule, FormsModule],
  templateUrl: './emi.html',
  styleUrl: './emi.scss',
})
export class Emi {
  loanAmount = 100000;
  interestRate = 8.5;
  tenure = 20;
  tenureUnit: 'years' | 'months' = 'years';

  currencyCode = 'USD';

  interestType: 'reducing' | 'flat' = 'reducing';
  paymentFrequency: 'monthly' | 'biweekly' | 'weekly' = 'monthly';

  startDate = new Date().toISOString().split('T')[0];

  emi = 0;
  totalPrincipal = 0;
  totalInterest = 0;
  totalPayment = 0;
  interestPercentage = 0;
  numberOfPayments = 0;
  loanEndDate = '';

  amortizationSchedule: AmortizationRow[] = [];

  currencies: Currency[] = [
    {
      code: 'USD',
      name: 'US Dollar',
      symbol: '$',
      locale: 'en-US',
    },
    {
      code: 'BDT',
      name: 'Bangladeshi Taka',
      symbol: '৳',
      locale: 'en-BD',
    },
    {
      code: 'EUR',
      name: 'Euro',
      symbol: '€',
      locale: 'de-DE',
    },
    {
      code: 'GBP',
      name: 'British Pound',
      symbol: '£',
      locale: 'en-GB',
    },
    {
      code: 'INR',
      name: 'Indian Rupee',
      symbol: '₹',
      locale: 'en-IN',
    },
    {
      code: 'AED',
      name: 'UAE Dirham',
      symbol: 'د.إ',
      locale: 'en-AE',
    },
    {
      code: 'SAR',
      name: 'Saudi Riyal',
      symbol: '﷼',
      locale: 'en-SA',
    },
    {
      code: 'CAD',
      name: 'Canadian Dollar',
      symbol: 'CA$',
      locale: 'en-CA',
    },
    {
      code: 'AUD',
      name: 'Australian Dollar',
      symbol: 'A$',
      locale: 'en-AU',
    },
    {
      code: 'JPY',
      name: 'Japanese Yen',
      symbol: '¥',
      locale: 'ja-JP',
    },
    {
      code: 'CNY',
      name: 'Chinese Yuan',
      symbol: '¥',
      locale: 'zh-CN',
    },
    {
      code: 'SGD',
      name: 'Singapore Dollar',
      symbol: 'S$',
      locale: 'en-SG',
    },
    {
      code: 'MYR',
      name: 'Malaysian Ringgit',
      symbol: 'RM',
      locale: 'ms-MY',
    },
    {
      code: 'CHF',
      name: 'Swiss Franc',
      symbol: 'CHF',
      locale: 'de-CH',
    },
    {
      code: 'NZD',
      name: 'New Zealand Dollar',
      symbol: 'NZ$',
      locale: 'en-NZ',
    },
  ];

  ngOnInit(): void {
    this.calculate();
  }

  get selectedCurrency(): Currency {
    return (
      this.currencies.find((currency) => currency.code === this.currencyCode) || this.currencies[0]
    );
  }

  calculate(): void {
    this.loanAmount = Number(this.loanAmount) || 0;
    this.interestRate = Number(this.interestRate) || 0;
    this.tenure = Number(this.tenure) || 0;

    if (this.loanAmount <= 0 || this.tenure <= 0) {
      this.resetResults();
      return;
    }

    let numberOfPayments = this.getNumberOfPayments();

    if (numberOfPayments <= 0) {
      this.resetResults();
      return;
    }

    this.numberOfPayments = Math.round(numberOfPayments);

    if (this.interestType === 'reducing') {
      this.calculateReducingBalance();
    } else {
      this.calculateFlatRate();
    }

    this.calculateEndDate();
  }

  private getNumberOfPayments(): number {
    if (this.paymentFrequency === 'monthly') {
      return this.tenureUnit === 'years' ? this.tenure * 12 : this.tenure;
    }

    if (this.paymentFrequency === 'biweekly') {
      return this.tenureUnit === 'years' ? this.tenure * 26 : (this.tenure / 12) * 26;
    }

    return this.tenureUnit === 'years' ? this.tenure * 52 : (this.tenure / 12) * 52;
  }

  private getPeriodicInterestRate(): number {
    const annualRate = this.interestRate / 100;

    if (this.paymentFrequency === 'monthly') {
      return annualRate / 12;
    }

    if (this.paymentFrequency === 'biweekly') {
      return annualRate / 26;
    }

    return annualRate / 52;
  }

  private calculateReducingBalance(): void {
    const principal = this.loanAmount;
    const rate = this.getPeriodicInterestRate();
    const payments = this.numberOfPayments;

    let emi = 0;

    if (rate === 0) {
      emi = principal / payments;
    } else {
      const power = Math.pow(1 + rate, payments);

      emi = (principal * rate * power) / (power - 1);
    }

    this.emi = emi;
    this.totalPrincipal = principal;
    this.totalPayment = emi * payments;
    this.totalInterest = this.totalPayment - principal;

    if (this.totalInterest < 0) {
      this.totalInterest = 0;
    }

    this.interestPercentage =
      this.totalPayment > 0 ? (this.totalInterest / this.totalPayment) * 100 : 0;

    this.generateReducingSchedule();
  }

  private generateReducingSchedule(): void {
    const schedule: AmortizationRow[] = [];

    let balance = this.loanAmount;
    const rate = this.getPeriodicInterestRate();

    for (let i = 1; i <= this.numberOfPayments; i++) {
      let interest = balance * rate;
      let principal = this.emi - interest;
      let paymentAmount = this.emi;

      if (i === this.numberOfPayments) {
        principal = balance;
        paymentAmount = principal + interest;
      }

      if (principal > balance) {
        principal = balance;
        paymentAmount = principal + interest;
      }

      balance -= principal;

      if (Math.abs(balance) < 0.01) {
        balance = 0;
      }

      schedule.push({
        payment: i,
        principal,
        interest,
        emi: paymentAmount,
        balance,
      });
    }

    this.amortizationSchedule = schedule;
  }

  private calculateFlatRate(): void {
    const principal = this.loanAmount;

    const annualInterest = principal * (this.interestRate / 100);

    const years = this.tenureUnit === 'years' ? this.tenure : this.tenure / 12;

    const totalInterest = annualInterest * years;

    const totalPayment = principal + totalInterest;

    const payments = this.numberOfPayments;

    const emi = totalPayment / payments;

    this.emi = emi;
    this.totalPrincipal = principal;
    this.totalInterest = totalInterest;
    this.totalPayment = totalPayment;

    this.interestPercentage = totalPayment > 0 ? (totalInterest / totalPayment) * 100 : 0;

    this.generateFlatSchedule();
  }

  private generateFlatSchedule(): void {
    const schedule: AmortizationRow[] = [];

    let balance = this.loanAmount;

    const principalPerPayment = this.loanAmount / this.numberOfPayments;

    const interestPerPayment = this.totalInterest / this.numberOfPayments;

    for (let i = 1; i <= this.numberOfPayments; i++) {
      let principal = principalPerPayment;

      if (i === this.numberOfPayments) {
        principal = balance;
      }

      const interest = interestPerPayment;

      balance -= principal;

      if (Math.abs(balance) < 0.01) {
        balance = 0;
      }

      schedule.push({
        payment: i,
        principal,
        interest,
        emi: principal + interest,
        balance,
      });
    }

    this.amortizationSchedule = schedule;
  }

  private calculateEndDate(): void {
    const date = new Date(this.startDate);

    if (isNaN(date.getTime())) {
      this.loanEndDate = '';
      return;
    }

    if (this.paymentFrequency === 'monthly') {
      date.setMonth(date.getMonth() + this.numberOfPayments);
    } else if (this.paymentFrequency === 'biweekly') {
      date.setDate(date.getDate() + this.numberOfPayments * 14);
    } else {
      date.setDate(date.getDate() + this.numberOfPayments * 7);
    }

    this.loanEndDate = date.toISOString().split('T')[0];
  }

  private resetResults(): void {
    this.emi = 0;
    this.totalPrincipal = 0;
    this.totalInterest = 0;
    this.totalPayment = 0;
    this.interestPercentage = 0;
    this.numberOfPayments = 0;
    this.loanEndDate = '';
    this.amortizationSchedule = [];
  }

  formatMoney(value: number): string {
    if (!isFinite(value)) {
      return `${this.selectedCurrency.symbol}0.00`;
    }

    try {
      return new Intl.NumberFormat(this.selectedCurrency.locale, {
        style: 'currency',
        currency: this.currencyCode,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    } catch {
      return `${this.selectedCurrency.symbol}${value.toFixed(2)}`;
    }
  }

  formatNumber(value: number): string {
    return new Intl.NumberFormat(this.selectedCurrency.locale, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  }

  get tenureLabel(): string {
    if (this.tenureUnit === 'years') {
      return this.tenure === 1 ? 'Year' : 'Years';
    }

    return this.tenure === 1 ? 'Month' : 'Months';
  }

  get frequencyLabel(): string {
    switch (this.paymentFrequency) {
      case 'biweekly':
        return 'Bi-weekly';

      case 'weekly':
        return 'Weekly';

      default:
        return 'Monthly';
    }
  }

  reset(): void {
    this.loanAmount = 100000;
    this.interestRate = 8.5;
    this.tenure = 20;
    this.tenureUnit = 'years';

    this.currencyCode = 'USD';

    this.interestType = 'reducing';
    this.paymentFrequency = 'monthly';

    this.startDate = new Date().toISOString().split('T')[0];

    this.calculate();
  }

  get visibleSchedule(): AmortizationRow[] {
    if (this.amortizationSchedule.length <= 120) {
      return this.amortizationSchedule;
    }

    return this.amortizationSchedule.slice(0, 120);
  }
}