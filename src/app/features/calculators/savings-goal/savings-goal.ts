import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Seo } from '../../../core/services/seo';

@Component({
  selector: 'app-savings-goal',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './savings-goal.html',
  styleUrl: './savings-goal.scss',
})
export class SavingsGoal implements OnInit {
    savingsForm: FormGroup;
  

  calculated = false;

  goalAmount = 0;
  currentSavings = 0;
  monthlyContribution = 0;
  annualInterestRate = 0;

  remainingAmount = 0;
  totalContribution = 0;
  interestEarned = 0;
  totalSaved = 0;

  monthsRequired = 0;
  progressPercentage = 0;

  constructor(
    private fb: FormBuilder,
    private seo: Seo,
  ) {
    this.savingsForm = this.fb.group({
    goalAmount: [
      10000,
      [Validators.required, Validators.min(1)],
    ],
    currentSavings: [
      2000,
      [Validators.required, Validators.min(0)],
    ],
    monthlyContribution: [
      400,
      [Validators.required, Validators.min(0)],
    ],
    annualInterestRate: [
      0,
      [Validators.required, Validators.min(0), Validators.max(100)],
    ],
  });
  }

  ngOnInit(): void {
    this.seo.setPage('savingsGoalCalculator');
  }

  calculateSavings(): void {
    if (this.savingsForm.invalid) {
      this.savingsForm.markAllAsTouched();
      return;
    }

    const {
      goalAmount = 0,
      currentSavings = 0,
      monthlyContribution = 0,
      annualInterestRate = 0,
    } = this.savingsForm.getRawValue();

    this.goalAmount = Number(goalAmount);
    this.currentSavings = Number(currentSavings);
    this.monthlyContribution = Number(monthlyContribution);
    this.annualInterestRate = Number(annualInterestRate);

    if (this.currentSavings >= this.goalAmount) {
      this.remainingAmount = 0;
      this.totalContribution = 0;
      this.interestEarned = 0;
      this.totalSaved = this.currentSavings;
      this.monthsRequired = 0;
      this.progressPercentage = 100;
      this.calculated = true;
      return;
    }

    if (
      this.monthlyContribution <= 0 &&
      this.annualInterestRate <= 0
    ) {
      this.savingsForm
        .get('monthlyContribution')
        ?.setErrors({ contributionRequired: true });

      this.calculated = false;
      return;
    }

    this.remainingAmount =
      this.goalAmount - this.currentSavings;

    const monthlyRate =
      this.annualInterestRate / 100 / 12;

    let balance = this.currentSavings;
    let contribution = 0;
    let interest = 0;
    let months = 0;

    while (balance < this.goalAmount && months < 1200) {
      months++;

      const earned =
        balance * monthlyRate;

      balance += earned + this.monthlyContribution;

      interest += earned;
      contribution += this.monthlyContribution;
    }

    this.monthsRequired = months;
    this.totalContribution = contribution;
    this.interestEarned = interest;
    this.totalSaved = balance;

    this.progressPercentage = Math.min(
      (balance / this.goalAmount) * 100,
      100,
    );

    this.calculated = true;

    this.scrollToResult();
  }

  isInvalid(name: string): boolean {
    const control = this.savingsForm.get(name);

    return !!(
      control?.invalid &&
      (control.touched || control.dirty)
    );
  }

  get remainingAfterCurrent(): number {
    return Math.max(
      Number(this.savingsForm.get('goalAmount')?.value || 0) -
        Number(this.savingsForm.get('currentSavings')?.value || 0),
      0,
    );
  }

  get timeLabel(): string {
    if (this.monthsRequired === 0) {
      return 'Goal reached';
    }

    const years = Math.floor(this.monthsRequired / 12);
    const months = this.monthsRequired % 12;

    if (!years) {
      return `${months} month${months !== 1 ? 's' : ''}`;
    }

    if (!months) {
      return `${years} year${years !== 1 ? 's' : ''}`;
    }

    return `${years}y ${months}m`;
  }

  get monthlyInterest(): number {
    return (
      this.currentSavings *
      (this.annualInterestRate / 100 / 12)
    );
  }

  private scrollToResult(): void {
    setTimeout(() => {
      document
        .querySelector('.result-card')
        ?.scrollIntoView({
          behavior: 'smooth',
          block: 'start',
        });
    }, 100);
  }
}