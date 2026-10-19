import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

type TaxStatus = 'available' | 'unavailable';

type IncomeFrequency = 'annual' | 'monthly' | 'weekly' | 'daily';

interface CountryConfig {
  code: string;
  name: string;
  currency: string;
  taxYears: number[];
  regions: RegionConfig[];
  filingStatuses: FilingStatus[];
  status: TaxStatus;
}

interface RegionConfig {
  code: string;
  name: string;
  status: TaxStatus;
}

interface FilingStatus {
  code: string;
  name: string;
}

interface CurrencyConfig {
  code: string;
  name: string;
  locale: string;
  decimals: number;
}

interface TaxBracket {
  upTo: number | null;
  rate: number;
}

interface ContributionRule {
  name: string;
  rate: number;
  ceiling?: number;
  threshold?: number;
}

interface TaxRule {
  country: string;
  taxYear: number;
  currency: string;
  source: string;
  sourceUrl: string;
  lastUpdated: string;
  status: TaxStatus;

  brackets: Record<string, TaxBracket[]>;
  standardDeductions: Record<string, number>;

  contributions: ContributionRule[];

  childCredit?: {
    amount: number;
    maxChildren?: number;
  };

  regionalTax?: Record<string, TaxBracket[]>;

  notes?: string;
}

interface TaxInput {
  country: string;
  taxYear: number;
  taxCurrency: string;
  displayCurrency: string;

  income: number;
  frequency: IncomeFrequency;

  filingStatus: string;
  region: string;

  age: number;
  spouse: boolean;
  dependents: number;
  disability: boolean;

  standardDeduction: boolean;
  additionalDeduction: number;
  retirementContribution: number;
  healthDeduction: number;
  educationDeduction: number;

  childCredit: number;
  otherCredit: number;
}

interface TaxBreakdownItem {
  label: string;
  value: number;
  percentage: number;
}

interface TaxPeriod {
  gross: number;
  tax: number;
  contributions: number;
  net: number;
}

interface TaxResult {
  available: boolean;
  message?: string;

  grossIncome: number;
  deductions: number;
  taxableIncome: number;

  incomeTax: number;
  socialContributions: number;
  regionalTax: number;
  taxCredits: number;

  totalTaxAndContributions: number;
  netIncome: number;

  effectiveTaxRate: number;
  marginalTaxRate: number;
  takeHomePercentage: number;

  annual: TaxPeriod;
  monthly: TaxPeriod;
  weekly: TaxPeriod;
  daily: TaxPeriod;

  breakdown: TaxBreakdownItem[];
}

interface ComparisonResult {
  country: string;
  currency: string;
  available: boolean;

  incomeTax: number;
  contributions: number;
  totalTax: number;
  netIncome: number;
  effectiveRate: number;

  message?: string;
}

@Component({
  selector: 'app-income-tax',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './income-tax.html',
  styleUrl: './income-tax.scss',
})
export class IncomeTax implements OnInit {
  private readonly fb = inject(FormBuilder);

  readonly primaryColor = '#e5322d';

  taxForm!: FormGroup;

  loading = false;
  exchangeLoading = false;

  hasCalculated = false;

  result: TaxResult | null = null;

  comparisonResults: ComparisonResult[] = [];

  exchangeRate: number | null = null;

  exchangeRateMessage = '';

  selectedComparisonCountries: string[] = ['USA', 'UK', 'CAN', 'DEU', 'AUS'];

  readonly countries: CountryConfig[] = [
    {
      code: 'USA',
      name: 'United States',
      currency: 'USD',
      taxYears: [2026],
      status: 'available',

      regions: [
        {
          code: 'CA',
          name: 'California',
          status: 'unavailable',
        },
        {
          code: 'NY',
          name: 'New York',
          status: 'unavailable',
        },
        {
          code: 'TX',
          name: 'Texas',
          status: 'available',
        },
        {
          code: 'FL',
          name: 'Florida',
          status: 'available',
        },
        {
          code: 'WA',
          name: 'Washington',
          status: 'available',
        },
      ],

      filingStatuses: [
        {
          code: 'single',
          name: 'Single',
        },
        {
          code: 'married_joint',
          name: 'Married Filing Jointly',
        },
        {
          code: 'married_separate',
          name: 'Married Filing Separately',
        },
        {
          code: 'head_household',
          name: 'Head of Household',
        },
      ],
    },

    {
      code: 'CAN',
      name: 'Canada',
      currency: 'CAD',
      taxYears: [],
      regions: [],
      filingStatuses: [
        {
          code: 'individual',
          name: 'Individual',
        },
      ],
      status: 'unavailable',
    },

    {
      code: 'UK',
      name: 'United Kingdom',
      currency: 'GBP',
      taxYears: [],
      regions: [],
      filingStatuses: [
        {
          code: 'individual',
          name: 'Individual',
        },
      ],
      status: 'unavailable',
    },

    {
      code: 'AUS',
      name: 'Australia',
      currency: 'AUD',
      taxYears: [],
      regions: [],
      filingStatuses: [
        {
          code: 'individual',
          name: 'Individual',
        },
      ],
      status: 'unavailable',
    },

    {
      code: 'DEU',
      name: 'Germany',
      currency: 'EUR',
      taxYears: [],
      regions: [],
      filingStatuses: [
        {
          code: 'individual',
          name: 'Individual',
        },
        {
          code: 'married',
          name: 'Married',
        },
      ],
      status: 'unavailable',
    },

    {
      code: 'FRA',
      name: 'France',
      currency: 'EUR',
      taxYears: [],
      regions: [],
      filingStatuses: [
        {
          code: 'individual',
          name: 'Individual',
        },
      ],
      status: 'unavailable',
    },

    {
      code: 'ESP',
      name: 'Spain',
      currency: 'EUR',
      taxYears: [],
      regions: [],
      filingStatuses: [
        {
          code: 'individual',
          name: 'Individual',
        },
      ],
      status: 'unavailable',
    },

    {
      code: 'ITA',
      name: 'Italy',
      currency: 'EUR',
      taxYears: [],
      regions: [],
      filingStatuses: [
        {
          code: 'individual',
          name: 'Individual',
        },
      ],
      status: 'unavailable',
    },

    {
      code: 'NLD',
      name: 'Netherlands',
      currency: 'EUR',
      taxYears: [],
      regions: [],
      filingStatuses: [
        {
          code: 'individual',
          name: 'Individual',
        },
      ],
      status: 'unavailable',
    },

    {
      code: 'CHE',
      name: 'Switzerland',
      currency: 'CHF',
      taxYears: [],
      regions: [],
      filingStatuses: [
        {
          code: 'individual',
          name: 'Individual',
        },
      ],
      status: 'unavailable',
    },

    {
      code: 'IRL',
      name: 'Ireland',
      currency: 'EUR',
      taxYears: [],
      regions: [],
      filingStatuses: [
        {
          code: 'individual',
          name: 'Individual',
        },
      ],
      status: 'unavailable',
    },

    {
      code: 'AUT',
      name: 'Austria',
      currency: 'EUR',
      taxYears: [],
      regions: [],
      filingStatuses: [
        {
          code: 'individual',
          name: 'Individual',
        },
      ],
      status: 'unavailable',
    },

    {
      code: 'BEL',
      name: 'Belgium',
      currency: 'EUR',
      taxYears: [],
      regions: [],
      filingStatuses: [
        {
          code: 'individual',
          name: 'Individual',
        },
      ],
      status: 'unavailable',
    },

    {
      code: 'PRT',
      name: 'Portugal',
      currency: 'EUR',
      taxYears: [],
      regions: [],
      filingStatuses: [
        {
          code: 'individual',
          name: 'Individual',
        },
      ],
      status: 'unavailable',
    },

    {
      code: 'SWE',
      name: 'Sweden',
      currency: 'SEK',
      taxYears: [],
      regions: [],
      filingStatuses: [
        {
          code: 'individual',
          name: 'Individual',
        },
      ],
      status: 'unavailable',
    },

    {
      code: 'NOR',
      name: 'Norway',
      currency: 'NOK',
      taxYears: [],
      regions: [],
      filingStatuses: [
        {
          code: 'individual',
          name: 'Individual',
        },
      ],
      status: 'unavailable',
    },

    {
      code: 'DNK',
      name: 'Denmark',
      currency: 'DKK',
      taxYears: [],
      regions: [],
      filingStatuses: [
        {
          code: 'individual',
          name: 'Individual',
        },
      ],
      status: 'unavailable',
    },

    {
      code: 'FIN',
      name: 'Finland',
      currency: 'EUR',
      taxYears: [],
      regions: [],
      filingStatuses: [
        {
          code: 'individual',
          name: 'Individual',
        },
      ],
      status: 'unavailable',
    },

    {
      code: 'POL',
      name: 'Poland',
      currency: 'PLN',
      taxYears: [],
      regions: [],
      filingStatuses: [
        {
          code: 'individual',
          name: 'Individual',
        },
      ],
      status: 'unavailable',
    },

    {
      code: 'IND',
      name: 'India',
      currency: 'INR',
      taxYears: [],
      regions: [],
      filingStatuses: [
        {
          code: 'individual',
          name: 'Individual',
        },
      ],
      status: 'unavailable',
    },

    {
      code: 'BGD',
      name: 'Bangladesh',
      currency: 'BDT',
      taxYears: [],
      regions: [],
      filingStatuses: [
        {
          code: 'individual',
          name: 'Individual',
        },
      ],
      status: 'unavailable',
    },

    {
      code: 'JPN',
      name: 'Japan',
      currency: 'JPY',
      taxYears: [],
      regions: [],
      filingStatuses: [
        {
          code: 'individual',
          name: 'Individual',
        },
      ],
      status: 'unavailable',
    },

    {
      code: 'KOR',
      name: 'South Korea',
      currency: 'KRW',
      taxYears: [],
      regions: [],
      filingStatuses: [
        {
          code: 'individual',
          name: 'Individual',
        },
      ],
      status: 'unavailable',
    },

    {
      code: 'SGP',
      name: 'Singapore',
      currency: 'SGD',
      taxYears: [],
      regions: [],
      filingStatuses: [
        {
          code: 'individual',
          name: 'Individual',
        },
      ],
      status: 'unavailable',
    },

    {
      code: 'MYS',
      name: 'Malaysia',
      currency: 'MYR',
      taxYears: [],
      regions: [],
      filingStatuses: [
        {
          code: 'individual',
          name: 'Individual',
        },
      ],
      status: 'unavailable',
    },

    {
      code: 'IDN',
      name: 'Indonesia',
      currency: 'IDR',
      taxYears: [],
      regions: [],
      filingStatuses: [
        {
          code: 'individual',
          name: 'Individual',
        },
      ],
      status: 'unavailable',
    },

    {
      code: 'NZL',
      name: 'New Zealand',
      currency: 'NZD',
      taxYears: [],
      regions: [],
      filingStatuses: [
        {
          code: 'individual',
          name: 'Individual',
        },
      ],
      status: 'unavailable',
    },

    {
      code: 'ARE',
      name: 'United Arab Emirates',
      currency: 'AED',
      taxYears: [],
      regions: [],
      filingStatuses: [
        {
          code: 'individual',
          name: 'Individual',
        },
      ],
      status: 'unavailable',
    },

    {
      code: 'SAU',
      name: 'Saudi Arabia',
      currency: 'SAR',
      taxYears: [],
      regions: [],
      filingStatuses: [
        {
          code: 'individual',
          name: 'Individual',
        },
      ],
      status: 'unavailable',
    },

    {
      code: 'QAT',
      name: 'Qatar',
      currency: 'QAR',
      taxYears: [],
      regions: [],
      filingStatuses: [
        {
          code: 'individual',
          name: 'Individual',
        },
      ],
      status: 'unavailable',
    },

    {
      code: 'ZAF',
      name: 'South Africa',
      currency: 'ZAR',
      taxYears: [],
      regions: [],
      filingStatuses: [
        {
          code: 'individual',
          name: 'Individual',
        },
      ],
      status: 'unavailable',
    },

    {
      code: 'BRA',
      name: 'Brazil',
      currency: 'BRL',
      taxYears: [],
      regions: [],
      filingStatuses: [
        {
          code: 'individual',
          name: 'Individual',
        },
      ],
      status: 'unavailable',
    },

    {
      code: 'MEX',
      name: 'Mexico',
      currency: 'MXN',
      taxYears: [],
      regions: [],
      filingStatuses: [
        {
          code: 'individual',
          name: 'Individual',
        },
      ],
      status: 'unavailable',
    },
  ];

  readonly currencies: CurrencyConfig[] = [
    {
      code: 'USD',
      name: 'US Dollar',
      locale: 'en-US',
      decimals: 2,
    },
    {
      code: 'EUR',
      name: 'Euro',
      locale: 'de-DE',
      decimals: 2,
    },
    {
      code: 'GBP',
      name: 'British Pound',
      locale: 'en-GB',
      decimals: 2,
    },
    {
      code: 'CAD',
      name: 'Canadian Dollar',
      locale: 'en-CA',
      decimals: 2,
    },
    {
      code: 'AUD',
      name: 'Australian Dollar',
      locale: 'en-AU',
      decimals: 2,
    },
    {
      code: 'NZD',
      name: 'New Zealand Dollar',
      locale: 'en-NZ',
      decimals: 2,
    },
    {
      code: 'BDT',
      name: 'Bangladeshi Taka',
      locale: 'bn-BD',
      decimals: 2,
    },
    {
      code: 'INR',
      name: 'Indian Rupee',
      locale: 'en-IN',
      decimals: 2,
    },
    {
      code: 'JPY',
      name: 'Japanese Yen',
      locale: 'ja-JP',
      decimals: 0,
    },
    {
      code: 'KRW',
      name: 'South Korean Won',
      locale: 'ko-KR',
      decimals: 0,
    },
    {
      code: 'SGD',
      name: 'Singapore Dollar',
      locale: 'en-SG',
      decimals: 2,
    },
    {
      code: 'MYR',
      name: 'Malaysian Ringgit',
      locale: 'ms-MY',
      decimals: 2,
    },
    {
      code: 'IDR',
      name: 'Indonesian Rupiah',
      locale: 'id-ID',
      decimals: 0,
    },
    {
      code: 'AED',
      name: 'UAE Dirham',
      locale: 'en-AE',
      decimals: 2,
    },
    {
      code: 'SAR',
      name: 'Saudi Riyal',
      locale: 'ar-SA',
      decimals: 2,
    },
    {
      code: 'QAR',
      name: 'Qatari Riyal',
      locale: 'ar-QA',
      decimals: 2,
    },
    {
      code: 'CHF',
      name: 'Swiss Franc',
      locale: 'de-CH',
      decimals: 2,
    },
    {
      code: 'SEK',
      name: 'Swedish Krona',
      locale: 'sv-SE',
      decimals: 2,
    },
    {
      code: 'NOK',
      name: 'Norwegian Krone',
      locale: 'nb-NO',
      decimals: 2,
    },
    {
      code: 'DKK',
      name: 'Danish Krone',
      locale: 'da-DK',
      decimals: 2,
    },
    {
      code: 'PLN',
      name: 'Polish Zloty',
      locale: 'pl-PL',
      decimals: 2,
    },
    {
      code: 'ZAR',
      name: 'South African Rand',
      locale: 'en-ZA',
      decimals: 2,
    },
    {
      code: 'BRL',
      name: 'Brazilian Real',
      locale: 'pt-BR',
      decimals: 2,
    },
    {
      code: 'MXN',
      name: 'Mexican Peso',
      locale: 'es-MX',
      decimals: 2,
    },
  ];

  readonly taxRules: TaxRule[] = [
    {
      country: 'USA',
      taxYear: 2026,
      currency: 'USD',

      source: 'U.S. Internal Revenue Service',
      sourceUrl: 'https://www.irs.gov/irb/2025-45_IRB',

      lastUpdated: '2026-01-01',

      status: 'available',

      standardDeductions: {
        single: 16100,
        married_joint: 32200,
        married_separate: 16100,
        head_household: 24150,
      },

      brackets: {
        single: [
          {
            upTo: 12400,
            rate: 0.1,
          },
          {
            upTo: 50400,
            rate: 0.12,
          },
          {
            upTo: 105700,
            rate: 0.22,
          },
          {
            upTo: 201775,
            rate: 0.24,
          },
          {
            upTo: 256225,
            rate: 0.32,
          },
          {
            upTo: 640600,
            rate: 0.35,
          },
          {
            upTo: null,
            rate: 0.37,
          },
        ],

        married_joint: [
          {
            upTo: 24800,
            rate: 0.1,
          },
          {
            upTo: 100800,
            rate: 0.12,
          },
          {
            upTo: 211400,
            rate: 0.22,
          },
          {
            upTo: 403550,
            rate: 0.24,
          },
          {
            upTo: 512450,
            rate: 0.32,
          },
          {
            upTo: 768700,
            rate: 0.35,
          },
          {
            upTo: null,
            rate: 0.37,
          },
        ],

        married_separate: [
          {
            upTo: 12400,
            rate: 0.1,
          },
          {
            upTo: 50400,
            rate: 0.12,
          },
          {
            upTo: 105700,
            rate: 0.22,
          },
          {
            upTo: 201775,
            rate: 0.24,
          },
          {
            upTo: 256225,
            rate: 0.32,
          },
          {
            upTo: 384350,
            rate: 0.35,
          },
          {
            upTo: null,
            rate: 0.37,
          },
        ],

        head_household: [
          {
            upTo: 17700,
            rate: 0.1,
          },
          {
            upTo: 67450,
            rate: 0.12,
          },
          {
            upTo: 105700,
            rate: 0.22,
          },
          {
            upTo: 201750,
            rate: 0.24,
          },
          {
            upTo: 256200,
            rate: 0.32,
          },
          {
            upTo: 640600,
            rate: 0.35,
          },
          {
            upTo: null,
            rate: 0.37,
          },
        ],
      },

      contributions: [
        {
          name: 'Social Security',
          rate: 0.062,
          ceiling: 184500,
        },
        {
          name: 'Medicare',
          rate: 0.0145,
        },
        {
          name: 'Additional Medicare',
          rate: 0.009,
          threshold: 200000,
        },
      ],

      childCredit: {
        amount: 2200,
      },

      notes:
        'Federal individual income tax rules. State/local tax is not included unless separately configured.',
    },
  ];

  readonly faqs = [
    {
      question: 'What is an income tax calculator?',
      answer:
        'An income tax calculator estimates income tax, mandatory contributions, deductions, credits and take-home income using the selected country and tax-year rules.',
    },
    {
      question: 'How is income tax calculated?',
      answer:
        'Taxable income is determined after applicable deductions, then the configured tax brackets are applied progressively. Credits and mandatory contributions are then included where applicable.',
    },
    {
      question: 'What is taxable income?',
      answer:
        'Taxable income is generally gross income reduced by deductions that are permitted under the applicable tax rules.',
    },
    {
      question: 'What is the difference between marginal and effective tax rate?',
      answer:
        'The marginal rate is the tax rate applied to the next unit of taxable income. The effective rate is total income tax divided by gross income.',
    },
    {
      question: 'What is take-home pay?',
      answer:
        'Take-home pay is the amount remaining after applicable income tax, social contributions and other deductions, after considering eligible credits.',
    },
    {
      question: 'Does income tax vary by country?',
      answer:
        'Yes. Countries use different tax brackets, deductions, credits, contribution systems, tax years and regional rules.',
    },
    {
      question: 'Can I calculate tax in another currency?',
      answer:
        'Yes, where an exchange-rate service is available. Tax is calculated in the tax-rule currency first and converted only for display.',
    },
    {
      question: 'Can I compare tax between countries?',
      answer:
        'Yes, but only countries with supported authoritative tax data can produce a calculated comparison.',
    },
    {
      question: 'What is a tax bracket?',
      answer:
        'A tax bracket is an income range taxed at a specific rate. Progressive systems apply different rates to different portions of income.',
    },
    {
      question: 'Does the calculator include social security contributions?',
      answer:
        'Where configured by the selected tax rules, employee social contributions are included separately from income tax.',
    },
    {
      question: 'Are calculations based on the selected tax year?',
      answer:
        'Yes. Tax brackets, deductions and contribution rules are selected from the configured tax year.',
    },
    {
      question: 'Can tax rules change during the year?',
      answer:
        'Yes. Tax laws can change through legislation, official guidance or inflation adjustments. Always verify important tax decisions with the relevant tax authority.',
    },
  ];

  // ============================================================
  // LIFECYCLE
  // ============================================================

  ngOnInit(): void {
    this.buildForm();
    this.handleCountryChanges();
  }

  // ============================================================
  // FORM
  // ============================================================

  private buildForm(): void {
    this.taxForm = this.fb.group({
      country: ['USA', Validators.required],

      taxYear: [2026, Validators.required],

      taxCurrency: ['USD', Validators.required],

      displayCurrency: ['USD', Validators.required],

      income: [100000, [Validators.required, Validators.min(0.01)]],

      frequency: ['annual', Validators.required],

      filingStatus: ['single', Validators.required],

      region: [''],

      age: [30, [Validators.min(0), Validators.max(120)]],

      spouse: [false],

      dependents: [0, [Validators.min(0), Validators.max(50)]],

      disability: [false],

      standardDeduction: [true],

      additionalDeduction: [0, Validators.min(0)],

      retirementContribution: [0, Validators.min(0)],

      healthDeduction: [0, Validators.min(0)],

      educationDeduction: [0, Validators.min(0)],

      childCredit: [0, Validators.min(0)],

      otherCredit: [0, Validators.min(0)],
    });
  }

  private handleCountryChanges(): void {
    this.taxForm.get('country')?.valueChanges.subscribe((countryCode: string) => {
      const country = this.getCountry(countryCode);

      if (!country) {
        return;
      }

      const firstYear = country.taxYears.length > 0 ? country.taxYears[0] : null;

      const firstStatus = country.filingStatuses.length > 0 ? country.filingStatuses[0].code : '';

      this.taxForm.patchValue(
        {
          taxYear: firstYear,

          taxCurrency: country.currency,

          filingStatus: firstStatus,

          region: '',
        },
        {
          emitEvent: false,
        },
      );

      this.result = null;

      this.hasCalculated = false;

      this.exchangeRate = null;

      this.exchangeRateMessage = '';

      this.comparisonResults = [];
    });
  }

  // ============================================================
  // GETTERS
  // ============================================================

  get selectedCountry(): CountryConfig | undefined {
    return this.getCountry(this.taxForm?.get('country')?.value);
  }

  get selectedRegions(): RegionConfig[] {
    return this.selectedCountry?.regions ?? [];
  }

  get selectedFilingStatuses(): FilingStatus[] {
    return this.selectedCountry?.filingStatuses ?? [];
  }

  get selectedTaxYears(): number[] {
    return this.selectedCountry?.taxYears ?? [];
  }

  get taxDataAvailable(): boolean {
    const country = this.selectedCountry;

    return !!country && country.status === 'available';
  }

  get regionRequired(): boolean {
    return this.selectedRegions.some((region) => region.status === 'available');
  }

  get selectedCountryName(): string {
    return this.selectedCountry?.name ?? 'Selected Country';
  }

  get selectedTaxYear(): number {
    return Number(this.taxForm?.get('taxYear')?.value ?? 0);
  }

  get currentCurrency(): string {
    return this.taxForm?.get('displayCurrency')?.value ?? 'USD';
  }

  get currentTaxCurrency(): string {
    return this.taxForm?.get('taxCurrency')?.value ?? 'USD';
  }

  get totalTaxPercentage(): number {
    if (!this.result || this.result.grossIncome <= 0) {
      return 0;
    }

    return Math.min(100, (this.result.totalTaxAndContributions / this.result.grossIncome) * 100);
  }

  // ============================================================
  // COUNTRY / TAX RULE
  // ============================================================

  private getCountry(countryCode: string): CountryConfig | undefined {
    if (!countryCode) {
      return undefined;
    }

    return this.countries.find((country) => country.code === countryCode);
  }

  private getTaxRule(countryCode: string, taxYear: number): TaxRule | undefined {
    return this.taxRules.find(
      (rule) =>
        rule.country === countryCode && rule.taxYear === taxYear && rule.status === 'available',
    );
  }

  // ============================================================
  // CALCULATE
  // ============================================================

  calculate(): void {
    this.markAllTouched();

    if (this.taxForm.invalid) {
      this.hasCalculated = false;
      return;
    }

    this.loading = true;

    try {
      const raw = this.taxForm.getRawValue();

      const input = this.buildTaxInput(raw);

      const country = this.getCountry(input.country);

      if (!country) {
        this.result = this.unavailableResult('Selected country could not be found.');

        this.hasCalculated = true;

        return;
      }

      if (country.status === 'unavailable') {
        this.result = this.unavailableResult(
          'Tax data for this country is currently unavailable. Please select another country.',
        );

        this.hasCalculated = true;

        return;
      }

      if (!country.taxYears.includes(input.taxYear)) {
        this.result = this.unavailableResult(
          'Tax data for this tax year is currently unavailable.',
        );

        this.hasCalculated = true;

        return;
      }

      const rule = this.getTaxRule(input.country, input.taxYear);

      if (!rule) {
        this.result = this.unavailableResult(
          'Tax data for this country and tax year is currently unavailable.',
        );

        this.hasCalculated = true;

        return;
      }

      if (this.regionRequired && !input.region) {
        this.result = this.unavailableResult('Please select a region to calculate your tax.');

        this.hasCalculated = true;

        return;
      }

      this.result = this.calculateTax(input, rule);

      this.hasCalculated = true;

      if (input.taxCurrency !== input.displayCurrency) {
        void this.loadExchangeRate(input.taxCurrency, input.displayCurrency);
      } else {
        this.exchangeRate = 1;

        this.exchangeRateMessage = '';
      }
    } finally {
      this.loading = false;
    }
  }

  private buildTaxInput(raw: any): TaxInput {
    return {
      country: String(raw.country ?? ''),

      taxYear: this.safeNumber(raw.taxYear, 0),

      taxCurrency: String(raw.taxCurrency ?? 'USD'),

      displayCurrency: String(raw.displayCurrency ?? 'USD'),

      income: this.safeNumber(raw.income, 0),

      frequency: this.normalizeFrequency(raw.frequency),

      filingStatus: String(raw.filingStatus ?? ''),

      region: String(raw.region ?? ''),

      age: this.safeNumber(raw.age, 0),

      spouse: Boolean(raw.spouse),

      dependents: this.safeNumber(raw.dependents, 0),

      disability: Boolean(raw.disability),

      standardDeduction: Boolean(raw.standardDeduction),

      additionalDeduction: this.safeNumber(raw.additionalDeduction, 0),

      retirementContribution: this.safeNumber(raw.retirementContribution, 0),

      healthDeduction: this.safeNumber(raw.healthDeduction, 0),

      educationDeduction: this.safeNumber(raw.educationDeduction, 0),

      childCredit: this.safeNumber(raw.childCredit, 0),

      otherCredit: this.safeNumber(raw.otherCredit, 0),
    };
  }

  private normalizeFrequency(value: unknown): IncomeFrequency {
    if (value === 'monthly' || value === 'weekly' || value === 'daily') {
      return value;
    }

    return 'annual';
  }

  private safeNumber(value: unknown, fallback = 0): number {
    const numberValue = Number(value);

    return Number.isFinite(numberValue) ? numberValue : fallback;
  }

  // ============================================================
  // TAX ENGINE
  // ============================================================

  private calculateTax(input: TaxInput, rule: TaxRule): TaxResult {
    const annualIncome = this.normalizeAnnualIncome(input.income, input.frequency);

    const standardDeduction = input.standardDeduction
      ? (rule.standardDeductions[input.filingStatus] ?? 0)
      : 0;

    const additionalDeductions =
      Math.max(0, input.additionalDeduction) +
      Math.max(0, input.retirementContribution) +
      Math.max(0, input.healthDeduction) +
      Math.max(0, input.educationDeduction);

    const deductions = Math.min(annualIncome, standardDeduction + additionalDeductions);

    const taxableIncome = Math.max(0, annualIncome - deductions);

    const brackets = rule.brackets[input.filingStatus];

    if (!brackets || brackets.length === 0) {
      return this.unavailableResult(
        'The selected filing status is not configured for this tax year.',
      );
    }

    const progressiveTax = this.calculateProgressiveTax(taxableIncome, brackets);

    let contributions = 0;

    for (const contribution of rule.contributions) {
      contributions += this.calculateContribution(annualIncome, contribution);
    }

    contributions = this.round(contributions);

    let regionalTax = 0;

    if (input.region && rule.regionalTax?.[input.region]) {
      regionalTax = this.calculateProgressiveTax(taxableIncome, rule.regionalTax[input.region]).tax;
    }

    let childCredit = 0;

    if (rule.childCredit) {
      const maxChildren = rule.childCredit.maxChildren ?? input.dependents;

      const eligibleChildren = Math.min(Math.max(0, input.dependents), maxChildren);

      childCredit = eligibleChildren * rule.childCredit.amount;
    }

    const requestedCredits = Math.max(0, input.childCredit + input.otherCredit);

    const totalAvailableCredits = childCredit + requestedCredits;

    const taxBeforeCredits = progressiveTax.tax + regionalTax;

    const taxCredits = Math.min(taxBeforeCredits, totalAvailableCredits);

    const totalTaxAndContributions = Math.max(0, taxBeforeCredits + contributions - taxCredits);

    const netIncome = Math.max(0, annualIncome - totalTaxAndContributions);

    const effectiveTaxRate = annualIncome > 0 ? (totalTaxAndContributions / annualIncome) * 100 : 0;

    const marginalTaxRate = progressiveTax.marginalRate * 100;

    const takeHomePercentage = annualIncome > 0 ? (netIncome / annualIncome) * 100 : 0;

    const breakdown = this.buildBreakdown(
      annualIncome,
      progressiveTax.tax,
      contributions,
      regionalTax,
      deductions,
      taxCredits,
      netIncome,
    );

    return {
      available: true,

      grossIncome: this.round(annualIncome),

      deductions: this.round(deductions),

      taxableIncome: this.round(taxableIncome),

      incomeTax: progressiveTax.tax,

      socialContributions: contributions,

      regionalTax: this.round(regionalTax),

      taxCredits: this.round(taxCredits),

      totalTaxAndContributions: this.round(totalTaxAndContributions),

      netIncome: this.round(netIncome),

      effectiveTaxRate: this.round(effectiveTaxRate),

      marginalTaxRate: this.round(marginalTaxRate),

      takeHomePercentage: this.round(takeHomePercentage),

      annual: {
        gross: this.round(annualIncome),

        tax: progressiveTax.tax,

        contributions,

        net: this.round(netIncome),
      },

      monthly: {
        gross: this.round(annualIncome / 12),

        tax: this.round(progressiveTax.tax / 12),

        contributions: this.round(contributions / 12),

        net: this.round(netIncome / 12),
      },

      weekly: {
        gross: this.round(annualIncome / 52),

        tax: this.round(progressiveTax.tax / 52),

        contributions: this.round(contributions / 52),

        net: this.round(netIncome / 52),
      },

      daily: {
        gross: this.round(annualIncome / 260),

        tax: this.round(progressiveTax.tax / 260),

        contributions: this.round(contributions / 260),

        net: this.round(netIncome / 260),
      },

      breakdown,
    };
  }

  getProgressWidth(value: number): number {
    return Math.min(Math.max(value || 0, 0), 100);
  }
  
  private normalizeAnnualIncome(amount: number, frequency: IncomeFrequency): number {
    if (!Number.isFinite(amount) || amount < 0) {
      return 0;
    }

    switch (frequency) {
      case 'monthly':
        return amount * 12;

      case 'weekly':
        return amount * 52;

      case 'daily':
        return amount * 260;

      case 'annual':
      default:
        return amount;
    }
  }

  private calculateProgressiveTax(
    taxableIncome: number,
    brackets: TaxBracket[],
  ): {
    tax: number;
    marginalRate: number;
  } {
    if (taxableIncome <= 0 || brackets.length === 0) {
      return {
        tax: 0,
        marginalRate: 0,
      };
    }

    let remaining = taxableIncome;

    let previousLimit = 0;

    let tax = 0;

    let marginalRate = 0;

    for (const bracket of brackets) {
      const upper = bracket.upTo === null ? Infinity : bracket.upTo;

      const bracketWidth = upper - previousLimit;

      const taxableAtBracket = Math.min(Math.max(remaining, 0), bracketWidth);

      if (taxableAtBracket > 0) {
        tax += taxableAtBracket * bracket.rate;

        marginalRate = bracket.rate;

        remaining -= taxableAtBracket;
      }

      previousLimit = upper;

      if (remaining <= 0) {
        break;
      }
    }

    return {
      tax: this.round(tax),

      marginalRate,
    };
  }

  private calculateContribution(income: number, rule: ContributionRule): number {
    let taxableAmount = Math.max(0, income);

    if (rule.threshold !== undefined) {
      taxableAmount = Math.max(0, income - rule.threshold);
    }

    if (rule.ceiling !== undefined) {
      taxableAmount = Math.min(taxableAmount, rule.ceiling);
    }

    return this.round(taxableAmount * rule.rate);
  }

  // ============================================================
  // BREAKDOWN
  // ============================================================

  private buildBreakdown(
    gross: number,
    incomeTax: number,
    contributions: number,
    regionalTax: number,
    deductions: number,
    credits: number,
    net: number,
  ): TaxBreakdownItem[] {
    const total = Math.max(gross, 1);

    return [
      {
        label: 'Income Tax',

        value: this.round(incomeTax),

        percentage: this.round((incomeTax / total) * 100),
      },

      {
        label: 'Social Contributions',

        value: this.round(contributions),

        percentage: this.round((contributions / total) * 100),
      },

      {
        label: 'Regional Tax',

        value: this.round(regionalTax),

        percentage: this.round((regionalTax / total) * 100),
      },

      {
        label: 'Deductions',

        value: this.round(deductions),

        percentage: this.round((deductions / total) * 100),
      },

      {
        label: 'Tax Credits',

        value: this.round(credits),

        percentage: this.round((credits / total) * 100),
      },

      {
        label: 'Take Home',

        value: this.round(net),

        percentage: this.round((net / total) * 100),
      },
    ];
  }

  // ============================================================
  // UNAVAILABLE
  // ============================================================

  private unavailableResult(message: string): TaxResult {
    const emptyPeriod: TaxPeriod = {
      gross: 0,
      tax: 0,
      contributions: 0,
      net: 0,
    };

    return {
      available: false,

      message,

      grossIncome: 0,

      deductions: 0,

      taxableIncome: 0,

      incomeTax: 0,

      socialContributions: 0,

      regionalTax: 0,

      taxCredits: 0,

      totalTaxAndContributions: 0,

      netIncome: 0,

      effectiveTaxRate: 0,

      marginalTaxRate: 0,

      takeHomePercentage: 0,

      annual: {
        ...emptyPeriod,
      },

      monthly: {
        ...emptyPeriod,
      },

      weekly: {
        ...emptyPeriod,
      },

      daily: {
        ...emptyPeriod,
      },

      breakdown: [],
    };
  }

  // ============================================================
  // EXCHANGE RATE
  // ============================================================

  async loadExchangeRate(from: string, to: string): Promise<void> {
    if (!from || !to) {
      return;
    }

    if (from === to) {
      this.exchangeRate = 1;

      this.exchangeRateMessage = '';

      return;
    }

    this.exchangeLoading = true;

    this.exchangeRate = null;

    this.exchangeRateMessage = '';

    try {
      const url = `https://api.frankfurter.app/latest?from=${encodeURIComponent(
        from,
      )}&to=${encodeURIComponent(to)}`;

      const response = await fetch(url);

      if (!response.ok) {
        throw new Error('Exchange rate request failed');
      }

      const data = await response.json();

      const rate = Number(data?.rates?.[to]);

      if (!Number.isFinite(rate) || rate <= 0) {
        throw new Error('Invalid exchange rate');
      }

      this.exchangeRate = rate;

      this.exchangeRateMessage = `1 ${from} = ${this.formatNumber(rate, 6)} ${to}`;
    } catch {
      this.exchangeRate = null;

      this.exchangeRateMessage =
        'Exchange rate unavailable. Results are shown in the tax calculation currency.';
    } finally {
      this.exchangeLoading = false;
    }
  }

  // ============================================================
  // CURRENCY FORMATTING
  // ============================================================

  formatCurrency(value: number, currencyCode?: string): string {
    const currency = currencyCode ?? this.taxForm?.get('displayCurrency')?.value ?? 'USD';

    const config = this.currencies.find((item) => item.code === currency);

    const locale = config?.locale ?? 'en-US';

    const decimals = config?.decimals ?? 2;

    const convertedValue = this.convertForDisplay(value, currency);

    return new Intl.NumberFormat(locale, {
      style: 'currency',

      currency,

      minimumFractionDigits: decimals,

      maximumFractionDigits: decimals,
    }).format(convertedValue);
  }

  formatTaxCurrency(value: number): string {
    const currency = this.taxForm?.get('taxCurrency')?.value ?? 'USD';

    const decimals = this.getCurrencyDecimals(currency);

    return new Intl.NumberFormat(this.getCurrencyLocale(currency), {
      style: 'currency',

      currency,

      minimumFractionDigits: decimals,

      maximumFractionDigits: decimals,
    }).format(value);
  }

  private convertForDisplay(value: number, targetCurrency?: string): number {
    const from = this.taxForm?.get('taxCurrency')?.value;

    const to = targetCurrency ?? this.taxForm?.get('displayCurrency')?.value;

    if (!from || !to || from === to) {
      return value;
    }

    if (this.exchangeRate === null) {
      return value;
    }

    return value * this.exchangeRate;
  }

  private getCurrencyLocale(code: string): string {
    return this.currencies.find((currency) => currency.code === code)?.locale ?? 'en-US';
  }

  private getCurrencyDecimals(code: string): number {
    return this.currencies.find((currency) => currency.code === code)?.decimals ?? 2;
  }

  formatNumber(value: number, decimals = 2): string {
    return new Intl.NumberFormat('en-US', {
      minimumFractionDigits: decimals,

      maximumFractionDigits: decimals,
    }).format(value);
  }

  formatPercent(value: number): string {
    return `${this.formatNumber(value, 2)}%`;
  }

  // ============================================================
  // FORM EVENTS
  // ============================================================

  onTaxCurrencyChange(): void {
    const currency = this.taxForm.get('taxCurrency')?.value;

    const country = this.selectedCountry;

    if (country && currency !== country.currency) {
      // Tax calculations remain
      // based on configured rule currency.
    }

    this.result = null;

    this.hasCalculated = false;

    this.exchangeRate = null;

    this.exchangeRateMessage = '';
  }

  onDisplayCurrencyChange(): void {
    const from = this.taxForm.get('taxCurrency')?.value;

    const to = this.taxForm.get('displayCurrency')?.value;

    if (!from || !to) {
      return;
    }

    if (from === to) {
      this.exchangeRate = 1;

      this.exchangeRateMessage = '';

      return;
    }

    if (this.hasCalculated) {
      void this.loadExchangeRate(from, to);
    }
  }

  onIncomeFrequencyChange(): void {
    this.result = null;

    this.hasCalculated = false;
  }

  // ============================================================
  // COMPARISON
  // ============================================================

  toggleComparison(countryCode: string): void {
    if (this.selectedComparisonCountries.includes(countryCode)) {
      this.selectedComparisonCountries = this.selectedComparisonCountries.filter(
        (code) => code !== countryCode,
      );
    } else {
      this.selectedComparisonCountries = [...this.selectedComparisonCountries, countryCode];
    }
  }

  isComparisonSelected(countryCode: string): boolean {
    return this.selectedComparisonCountries.includes(countryCode);
  }

  compareCountries(): void {
    if (!this.taxForm || this.taxForm.invalid) {
      this.markAllTouched();

      return;
    }

    const raw = this.taxForm.getRawValue();

    const annualIncome = this.normalizeAnnualIncome(
      this.safeNumber(raw.income, 0),
      this.normalizeFrequency(raw.frequency),
    );

    this.comparisonResults = this.selectedComparisonCountries.map((countryCode) => {
      const country = this.getCountry(countryCode);

      if (!country) {
        return {
          country: countryCode,

          currency: '',

          available: false,

          incomeTax: 0,

          contributions: 0,

          totalTax: 0,

          netIncome: 0,

          effectiveRate: 0,

          message: 'Country unavailable.',
        };
      }

      const rule = this.getTaxRule(countryCode, this.safeNumber(raw.taxYear, 0));

      if (country.status !== 'available' || !rule) {
        return {
          country: country.name,

          currency: country.currency,

          available: false,

          incomeTax: 0,

          contributions: 0,

          totalTax: 0,

          netIncome: 0,

          effectiveRate: 0,

          message: 'Tax data unavailable for selected tax year.',
        };
      }

      const filingStatus = rule.brackets[raw.filingStatus]
        ? String(raw.filingStatus)
        : Object.keys(rule.brackets)[0];

      const comparisonInput: TaxInput = {
        country: countryCode,

        taxYear: rule.taxYear,

        taxCurrency: country.currency,

        displayCurrency: country.currency,

        income: annualIncome,

        frequency: 'annual',

        filingStatus,

        region: '',

        age: this.safeNumber(raw.age, 0),

        spouse: Boolean(raw.spouse),

        dependents: this.safeNumber(raw.dependents, 0),

        disability: Boolean(raw.disability),

        standardDeduction: Boolean(raw.standardDeduction),

        additionalDeduction: this.safeNumber(raw.additionalDeduction, 0),

        retirementContribution: this.safeNumber(raw.retirementContribution, 0),

        healthDeduction: this.safeNumber(raw.healthDeduction, 0),

        educationDeduction: this.safeNumber(raw.educationDeduction, 0),

        childCredit: this.safeNumber(raw.childCredit, 0),

        otherCredit: this.safeNumber(raw.otherCredit, 0),
      };

      const calculated = this.calculateTax(comparisonInput, rule);

      return {
        country: country.name,

        currency: country.currency,

        available: calculated.available,

        incomeTax: calculated.incomeTax,

        contributions: calculated.socialContributions,

        totalTax: calculated.totalTaxAndContributions,

        netIncome: calculated.netIncome,

        effectiveRate: calculated.effectiveTaxRate,

        message: calculated.message,
      };
    });
  }

  // ============================================================
  // TEMPLATE HELPERS
  // ============================================================

  getFormControl(name: string): FormControl {
    return this.taxForm.get(name) as FormControl;
  }

  isInvalid(name: string): boolean {
    const control = this.taxForm.get(name);

    return !!(control && control.invalid && (control.touched || control.dirty));
  }

  private markAllTouched(): void {
    if (!this.taxForm) {
      return;
    }

    Object.values(this.taxForm.controls).forEach((control) => {
      control.markAsTouched();
    });
  }

  // ============================================================
  // MISC
  // ============================================================

  private round(value: number): number {
    if (!Number.isFinite(value)) {
      return 0;
    }

    return Math.round((value + Number.EPSILON) * 100) / 100;
  }
}