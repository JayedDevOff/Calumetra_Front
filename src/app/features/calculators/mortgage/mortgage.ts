import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Seo } from '../../../core/services/seo';

@Component({
  selector: 'app-mortgage',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './mortgage.html',
  styleUrl: './mortgage.scss',
})
export class Mortgage implements OnInit {
  mortgageForm: FormGroup;

  calculated = false;

  monthlyPayment = 0;
  totalPayment = 0;
  totalInterest = 0;
  loanAmount = 0;

  principalPercentage = 0;
  interestPercentage = 0;

  constructor(
    private fb: FormBuilder,
    private seo: Seo,
  ) {
    this.mortgageForm = this.fb.group({
      homePrice: [300000, [Validators.required, Validators.min(1000), Validators.max(100000000)]],
      downPayment: [60000, [Validators.required, Validators.min(0), Validators.max(100000000)]],
      interestRate: [6.5, [Validators.required, Validators.min(0), Validators.max(30)]],
      loanTerm: [30, [Validators.required, Validators.min(1), Validators.max(50)]],
    });
  }

  ngOnInit(): void {
    this.seo.setPage('mortgageCalculator');
  }

  calculateMortgage(): void {
    if (this.mortgageForm.invalid) {
      this.mortgageForm.markAllAsTouched();
      return;
    }

    const homePrice = Number(this.mortgageForm.value.homePrice) || 0;
    const downPayment = Number(this.mortgageForm.value.downPayment) || 0;
    const annualRate = Number(this.mortgageForm.value.interestRate) || 0;
    const loanTerm = Number(this.mortgageForm.value.loanTerm) || 0;

    if (downPayment > homePrice) {
      this.mortgageForm.get('downPayment')?.setErrors({
        max: true,
      });
      return;
    }

    this.loanAmount = homePrice - downPayment;

    const numberOfPayments = loanTerm * 12;
    const monthlyRate = annualRate / 100 / 12;

    if (this.loanAmount <= 0) {
      this.monthlyPayment = 0;
      this.totalPayment = 0;
      this.totalInterest = 0;
    } else if (monthlyRate === 0) {
      this.monthlyPayment = this.loanAmount / numberOfPayments;
      this.totalPayment = this.loanAmount;
      this.totalInterest = 0;
    } else {
      this.monthlyPayment =
        (this.loanAmount * monthlyRate * Math.pow(1 + monthlyRate, numberOfPayments)) /
        (Math.pow(1 + monthlyRate, numberOfPayments) - 1);

      this.totalPayment = this.monthlyPayment * numberOfPayments;
      this.totalInterest = this.totalPayment - this.loanAmount;
    }

    if (this.totalPayment > 0) {
      this.principalPercentage = (this.loanAmount / this.totalPayment) * 100;

      this.interestPercentage = (this.totalInterest / this.totalPayment) * 100;
    } else {
      this.principalPercentage = 0;
      this.interestPercentage = 0;
    }

    this.monthlyPayment = Math.round(this.monthlyPayment);
    this.totalPayment = Math.round(this.totalPayment);
    this.totalInterest = Math.round(this.totalInterest);
    this.loanAmount = Math.round(this.loanAmount);

    this.calculated = true;

    setTimeout(() => {
      document.querySelector('.result-card')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 100);
  }

  isInvalid(controlName: string): boolean {
    const control = this.mortgageForm.get(controlName);

    return !!(control && control.invalid && (control.touched || control.dirty));
  }

  get downPaymentPercentage(): number {
    const homePrice = Number(this.mortgageForm.value.homePrice) || 0;
    const downPayment = Number(this.mortgageForm.value.downPayment) || 0;

    if (homePrice <= 0) {
      return 0;
    }

    return Math.min((downPayment / homePrice) * 100, 100);
  }

  get loanTermLabel(): string {
    const term = Number(this.mortgageForm.value.loanTerm) || 0;

    return term === 1 ? 'year' : 'years';
  }

  get monthlyInterest(): number {
    const rate = Number(this.mortgageForm.value.interestRate) || 0;

    return rate / 100 / 12;
  }
}
