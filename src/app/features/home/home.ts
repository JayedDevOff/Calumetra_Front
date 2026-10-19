import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { Footer } from '../../shared/components/footer/footer';

@Component({
  selector: 'app-home',
  imports: [Footer],
  templateUrl: './home.html',
  styleUrl: './home.scss',
})
export class Home {
  constructor(private router: Router) {}

  goAgeCalculator() {
    this.router.navigate(['/calculators/age']);
  }

  goBmiCalculator() {
    this.router.navigate(['/calculators/bmi']);
  }

  goEmiCalculator() {
    this.router.navigate(['/calculators/emi']);
  }

  goCgpaCalculator() {
    this.router.navigate(['/calculators/cgpa']);
  }

  goIncomeTaxCalculator() {
    this.router.navigate(['/income-tax-calculator']);
  }

  goPaycheckCalculator() {
    this.router.navigate(['/calculators/paycheck']);
  }
  
  goCalorieCalculator() {
    this.router.navigate(['/calorie-calculator']);
  }
  goMortgageCalculator() {
    this.router.navigate(['/mortgage/calculator']);
  }
  goPercentageCalculator() {
    this.router.navigate(['/percentage/calculator']);
  }
 goSavingsGoalCalculator() {
  this.router.navigate(['/savings-goal-calculator']);
}
 goDiscountCalculator() {
  this.router.navigate(['/discount-calculator']);
}
}
