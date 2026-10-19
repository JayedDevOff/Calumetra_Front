import { CommonModule } from '@angular/common';
import { Component, HostListener, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Seo } from '../../../core/services/seo';

interface Currency {
  code: string;
  name: string;
  symbol: string;
}

interface GrowthRow {
  period: number;
  label: string;
  balance: number;
  contributions: number;
  interest: number;
}

interface ChartPoint {
  x: number;
  y: number;
  balance: number;
  label: string;
}

@Component({
  selector: 'app-compound-interest',
  imports: [CommonModule, FormsModule],
  templateUrl: './compound-interest.html',
  styleUrl: './compound-interest.scss',
})
export class CompoundInterest implements OnInit {
  currencies: Currency[] = [
    { code: 'USD', name: 'US Dollar', symbol: '$' },
    { code: 'EUR', name: 'Euro', symbol: '€' },
    { code: 'GBP', name: 'British Pound', symbol: '£' },
    { code: 'BDT', name: 'Bangladeshi Taka', symbol: '৳' },
    { code: 'INR', name: 'Indian Rupee', symbol: '₹' },
    { code: 'CAD', name: 'Canadian Dollar', symbol: 'C$' },
    { code: 'AUD', name: 'Australian Dollar', symbol: 'A$' },
    { code: 'JPY', name: 'Japanese Yen', symbol: '¥' },
    { code: 'CHF', name: 'Swiss Franc', symbol: 'CHF' },
    { code: 'SGD', name: 'Singapore Dollar', symbol: 'S$' },
    { code: 'AED', name: 'UAE Dirham', symbol: 'د.إ' },
    { code: 'SAR', name: 'Saudi Riyal', symbol: '﷼' },
    { code: 'NZD', name: 'New Zealand Dollar', symbol: 'NZ$' },
    { code: 'HKD', name: 'Hong Kong Dollar', symbol: 'HK$' },
  ];

  selectedCurrency = 'USD';

  initialInvestment = 10000;
  monthlyContribution = 500;
  annualRate = 8;
  investmentYears = 20;
  investmentMonths = 0;
  compoundFrequency = 12;
  contributionTiming = 'end';
  inflationRate = 0;

  finalBalance = 0;
  totalContributions = 0;
  totalInterest = 0;
  inflationAdjustedBalance = 0;
  effectiveAnnualRate = 0;
  growthMultiple = 0;
  doublingTime = 0;

  growthData: GrowthRow[] = [];
  chartPoints: ChartPoint[] = [];

  chartWidth = 1000;
  chartHeight = 360;
  chartPaddingLeft = 72;
  chartPaddingRight = 24;
  chartPaddingTop = 28;
  chartPaddingBottom = 48;

  chartMax = 0;
  chartMin = 0;

  selectedChartIndex = -1;
  chartTooltipX = 0;
  chartTooltipY = 0;
  chartTooltipBalance = 0;
  chartTooltipLabel = '';

  chartVisiblePoints: ChartPoint[] = [];
  constructor(private seo: Seo) {}

  ngOnInit(): void {
    this.calculate();
    this.seo.setPage('compoundInterestCalculator');
  }

  @HostListener('window:resize')
  onResize(): void {
    this.buildChart();
  }

  get selectedCurrencyInfo(): Currency {
    return this.currencies.find((c) => c.code === this.selectedCurrency) || this.currencies[0];
  }

  get currencySymbol(): string {
    return this.selectedCurrencyInfo.symbol;
  }

  get currencyName(): string {
    return this.selectedCurrencyInfo.name;
  }

  calculate(): void {
    const years = Math.max(0, Number(this.investmentYears) || 0);
    const months = Math.max(0, Number(this.investmentMonths) || 0);
    const totalMonths = years * 12 + months;

    const principal = Math.max(0, Number(this.initialInvestment) || 0);
    const monthlyPayment = Math.max(0, Number(this.monthlyContribution) || 0);
    const annualRate = Math.max(0, Number(this.annualRate) || 0) / 100;
    const inflation = Math.max(0, Number(this.inflationRate) || 0) / 100;

    const frequency = Math.max(1, Number(this.compoundFrequency) || 12);

    this.totalContributions = principal + monthlyPayment * totalMonths;

    if (totalMonths === 0) {
      this.finalBalance = principal;
      this.totalInterest = 0;
      this.inflationAdjustedBalance = principal;
      this.effectiveAnnualRate = annualRate * 100;
      this.growthMultiple = principal > 0 ? 1 : 0;
      this.doublingTime = annualRate > 0 ? Math.log(2) / annualRate : 0;

      this.buildGrowthData();
      this.buildChart();
      return;
    }

    const equivalentMonthlyRate =
      annualRate === 0 ? 0 : Math.pow(1 + annualRate / frequency, frequency / 12) - 1;

    let balance = principal;

    for (let month = 1; month <= totalMonths; month++) {
      if (this.contributionTiming === 'beginning') {
        balance += monthlyPayment;
      }

      if (equivalentMonthlyRate > 0) {
        balance *= 1 + equivalentMonthlyRate;
      }

      if (this.contributionTiming === 'end') {
        balance += monthlyPayment;
      }
    }

    this.finalBalance = balance;
    this.totalInterest = Math.max(0, this.finalBalance - this.totalContributions);

    this.effectiveAnnualRate = (Math.pow(1 + annualRate / frequency, frequency) - 1) * 100;

    this.inflationAdjustedBalance =
      inflation > 0
        ? this.finalBalance / Math.pow(1 + inflation, totalMonths / 12)
        : this.finalBalance;

    this.growthMultiple = principal > 0 ? this.finalBalance / principal : 0;

    this.doublingTime =
      annualRate > 0 ? Math.log(2) / (frequency * Math.log(1 + annualRate / frequency)) : 0;

    this.buildGrowthData();
    this.buildChart();
  }

  buildGrowthData(): void {
    const years = Math.max(0, Number(this.investmentYears) || 0);
    const months = Math.max(0, Number(this.investmentMonths) || 0);
    const totalMonths = years * 12 + months;

    const principal = Math.max(0, Number(this.initialInvestment) || 0);
    const monthlyPayment = Math.max(0, Number(this.monthlyContribution) || 0);
    const annualRate = Math.max(0, Number(this.annualRate) || 0) / 100;
    const frequency = Math.max(1, Number(this.compoundFrequency) || 12);

    const monthlyRate =
      annualRate === 0 ? 0 : Math.pow(1 + annualRate / frequency, frequency / 12) - 1;

    this.growthData = [];

    if (totalMonths === 0) {
      this.growthData.push({
        period: 0,
        label: 'Start',
        balance: principal,
        contributions: principal,
        interest: 0,
      });

      return;
    }

    let balance = principal;

    this.growthData.push({
      period: 0,
      label: 'Start',
      balance,
      contributions: principal,
      interest: 0,
    });

    for (let month = 1; month <= totalMonths; month++) {
      if (this.contributionTiming === 'beginning') {
        balance += monthlyPayment;
      }

      if (monthlyRate > 0) {
        balance *= 1 + monthlyRate;
      }

      if (this.contributionTiming === 'end') {
        balance += monthlyPayment;
      }

      const isYearEnd = month % 12 === 0;
      const isFinalMonth = month === totalMonths;

      if (isYearEnd || isFinalMonth) {
        const contributionAmount = principal + monthlyPayment * month;

        const interestAmount = Math.max(0, balance - contributionAmount);

        const yearNumber = Math.ceil(month / 12);

        this.growthData.push({
          period: month,
          label: month % 12 === 0 ? `Year ${yearNumber}` : `${yearNumber}Y ${month % 12}M`,
          balance,
          contributions: contributionAmount,
          interest: interestAmount,
        });
      }
    }
  }

  buildChart(): void {
    if (!this.growthData.length) {
      this.chartPoints = [];
      this.chartVisiblePoints = [];
      return;
    }

    const values = this.growthData.map((item) => item.balance);

    this.chartMin = 0;
    this.chartMax = Math.max(...values, 1);

    const plotWidth = this.chartWidth - this.chartPaddingLeft - this.chartPaddingRight;

    const plotHeight = this.chartHeight - this.chartPaddingTop - this.chartPaddingBottom;

    this.chartPoints = this.growthData.map((item, index) => {
      const x =
        this.chartPaddingLeft +
        (this.growthData.length === 1
          ? plotWidth / 2
          : (index / (this.growthData.length - 1)) * plotWidth);

      const ratio = this.chartMax > 0 ? item.balance / this.chartMax : 0;

      const y = this.chartPaddingTop + plotHeight - ratio * plotHeight;

      return {
        x,
        y,
        balance: item.balance,
        label: item.label,
      };
    });

    this.chartVisiblePoints = this.chartPoints;
  }

  getChartPath(): string {
    if (!this.chartPoints.length) {
      return '';
    }

    return this.chartPoints
      .map((point, index) => `${index === 0 ? 'M' : 'L'} ${point.x} ${point.y}`)
      .join(' ');
  }

  getChartAreaPath(): string {
    if (!this.chartPoints.length) {
      return '';
    }

    const bottom = this.chartHeight - this.chartPaddingBottom;

    const first = this.chartPoints[0];
    const last = this.chartPoints[this.chartPoints.length - 1];

    return `${this.getChartPath()} L ${last.x} ${bottom} L ${first.x} ${bottom} Z`;
  }

  getYAxisValue(index: number): number {
    const steps = 4;
    return (this.chartMax / steps) * (steps - index);
  }

  getYAxisY(index: number): number {
    const plotHeight = this.chartHeight - this.chartPaddingTop - this.chartPaddingBottom;

    return this.chartPaddingTop + (plotHeight / 4) * index;
  }

  getXAxisLabel(index: number): string {
    if (!this.growthData.length) {
      return '';
    }

    const lastIndex = this.growthData.length - 1;

    if (index === 0) {
      return this.growthData[0].label;
    }

    if (index === lastIndex) {
      return this.growthData[lastIndex].label;
    }

    const middleIndex = Math.floor(lastIndex / 2);

    if (index === middleIndex) {
      return this.growthData[middleIndex].label;
    }

    return '';
  }

  showTooltip(index: number): void {
    if (!this.chartPoints[index]) {
      return;
    }

    const point = this.chartPoints[index];

    this.selectedChartIndex = index;
    this.chartTooltipX = point.x;
    this.chartTooltipY = Math.max(12, point.y - 72);
    this.chartTooltipBalance = point.balance;
    this.chartTooltipLabel = point.label;
  }

  hideTooltip(): void {
    this.selectedChartIndex = -1;
  }

  formatCurrency(value: number): string {
    try {
      return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: this.selectedCurrency,
        minimumFractionDigits: 2,
        maximumFractionDigits: 2,
      }).format(value);
    } catch {
      return `${this.currencySymbol}${value.toFixed(2)}`;
    }
  }

  formatCompactCurrency(value: number): string {
    const absolute = Math.abs(value);
    const sign = value < 0 ? '-' : '';

    if (absolute >= 1000000000) {
      return `${sign}${this.currencySymbol}${(absolute / 1000000000).toFixed(1)}B`;
    }

    if (absolute >= 1000000) {
      return `${sign}${this.currencySymbol}${(absolute / 1000000).toFixed(1)}M`;
    }

    if (absolute >= 1000) {
      return `${sign}${this.currencySymbol}${(absolute / 1000).toFixed(1)}K`;
    }

    return `${sign}${this.currencySymbol}${absolute.toFixed(0)}`;
  }

  formatNumber(value: number): string {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: 0,
      maximumFractionDigits: 2,
    }).format(value);
  }

  formatPercent(value: number): string {
    return `${value.toFixed(2)}%`;
  }

  formatYears(value: number): string {
    if (!value || value <= 0) {
      return '—';
    }

    const years = Math.floor(value);
    const months = Math.round((value - years) * 12);

    if (months === 0) {
      return `${years} years`;
    }

    if (years === 0) {
      return `${months} months`;
    }

    return `${years}y ${months}m`;
  }

  get totalInvestmentPeriod(): string {
    const totalMonths =
      Math.max(0, Number(this.investmentYears) || 0) * 12 +
      Math.max(0, Number(this.investmentMonths) || 0);

    const years = Math.floor(totalMonths / 12);
    const months = totalMonths % 12;

    if (years === 0) {
      return `${months} months`;
    }

    if (months === 0) {
      return `${years} years`;
    }

    return `${years} years ${months} months`;
  }

  get contributionFrequencyText(): string {
    return this.contributionTiming === 'beginning'
      ? 'Beginning of each month'
      : 'End of each month';
  }

  get compoundFrequencyText(): string {
    switch (this.compoundFrequency) {
      case 1:
        return 'Annually';
      case 2:
        return 'Semi-annually';
      case 4:
        return 'Quarterly';
      case 12:
        return 'Monthly';
      case 365:
        return 'Daily';
      default:
        return `${this.compoundFrequency} times per year`;
    }
  }
}
