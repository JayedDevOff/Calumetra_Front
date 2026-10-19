import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Calculator, CALCULATORS } from '../../../core/models/calculator.model';

@Component({
  selector: 'app-calculator-card',
  imports: [CommonModule, RouterModule],
  templateUrl: './calculator-card.html',
  styleUrl: './calculator-card.scss',
})
export class CalculatorCard {
  calculators: Calculator[] = CALCULATORS;
}
