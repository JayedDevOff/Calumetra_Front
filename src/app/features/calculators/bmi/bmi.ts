import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Seo } from '../../../core/services/seo';

@Component({
  selector: 'app-bmi',
  imports: [CommonModule, FormsModule],
  templateUrl: './bmi.html',
  styleUrl: './bmi.scss',
})
export class Bmi implements OnInit {
  heightUnit: 'cm' | 'ftin' = 'cm';
  weightUnit: 'kg' | 'lb' = 'kg';

  height: number | null = null;
  feet: number | null = null;
  inches: number | null = null;
  weight: number | null = null;

  bmi: number | null = null;
  status = '';

  heightInCm: number | null = null;
  weightInKg: number | null = null;

  healthyMinWeight: number | null = null;
  healthyMaxWeight: number | null = null;

  weightDifference: number | null = null;

  recommendation = '';
  recommendationTitle = '';
  recommendationIcon = '';

  constructor(private seo: Seo) {}

  ngOnInit(): void {
    this.seo.setPage('bmiCalculator');
  }

  changeHeightUnit(unit: 'cm' | 'ftin'): void {
    this.heightUnit = unit;

    this.height = null;
    this.feet = null;
    this.inches = null;

    this.clearResult();
  }

  changeWeightUnit(unit: 'kg' | 'lb'): void {
    this.weightUnit = unit;

    this.weight = null;

    this.clearResult();
  }

  calculateBMI(): void {
    let heightCm = 0;

    if (this.heightUnit === 'cm') {
      if (this.height === null || this.height <= 0) {
        this.clearResult();
        return;
      }

      heightCm = this.height;
    }

    if (this.heightUnit === 'ftin') {
      if (
        this.feet === null ||
        this.feet < 0 ||
        this.inches === null ||
        this.inches < 0 ||
        this.inches >= 12 ||
        (this.feet === 0 && this.inches === 0)
      ) {
        this.clearResult();
        return;
      }

      const totalInches = this.feet * 12 + this.inches;

      heightCm = totalInches * 2.54;
    }

    if (heightCm <= 0 || this.weight === null || this.weight <= 0) {
      this.clearResult();
      return;
    }

    let weightKg = this.weight;

    if (this.weightUnit === 'lb') {
      weightKg = this.weight * 0.45359237;
    }

    const heightMeters = heightCm / 100;

    const calculatedBMI = weightKg / (heightMeters * heightMeters);

    this.heightInCm = Number(heightCm.toFixed(1));
    this.weightInKg = Number(weightKg.toFixed(1));
    this.bmi = Number(calculatedBMI.toFixed(1));

    this.calculateHealthyWeightRange(heightMeters);
    this.setRecommendation();
  }

  private calculateHealthyWeightRange(heightMeters: number): void {
    const minWeight = 18.5 * heightMeters * heightMeters;

    const maxWeight = 24.9 * heightMeters * heightMeters;

    this.healthyMinWeight = Number(minWeight.toFixed(1));
    this.healthyMaxWeight = Number(maxWeight.toFixed(1));

    if (this.weightInKg === null) {
      this.weightDifference = null;
      return;
    }

    if (this.weightInKg < this.healthyMinWeight) {
      this.weightDifference = Number((this.healthyMinWeight - this.weightInKg).toFixed(1));

      return;
    }

    if (this.weightInKg > this.healthyMaxWeight) {
      this.weightDifference = Number((this.weightInKg - this.healthyMaxWeight).toFixed(1));

      return;
    }

    this.weightDifference = 0;
  }

  private setRecommendation(): void {
    if (this.bmi === null) {
      this.status = '';
      this.recommendationTitle = '';
      this.recommendation = '';
      this.recommendationIcon = '';
      return;
    }

    if (this.bmi < 18.5) {
      this.status = 'Underweight';
      this.recommendationTitle = 'Consider gradual weight gain';
      this.recommendationIcon = '↗';

      this.recommendation =
        `Your BMI is below the general adult healthy BMI range. ` +
        `Based on BMI alone, gaining approximately ${this.weightDifference ?? 0} kg ` +
        `would bring your current weight to around the lower end of the general healthy BMI range.`;
      return;
    }

    if (this.bmi < 25) {
      this.status = 'Normal Weight';
      this.recommendationTitle = 'Maintain your current weight';
      this.recommendationIcon = '✓';

      this.recommendation =
        'Your current weight is within the general adult healthy BMI range. ' +
        'Maintaining a balanced diet and regular physical activity can support overall health.';
      return;
    }

    if (this.bmi < 30) {
      this.status = 'Overweight';
      this.recommendationTitle = 'Consider gradual weight reduction';
      this.recommendationIcon = '↘';

      this.recommendation =
        `Your BMI is above the general adult healthy BMI range. ` +
        `A gradual reduction of approximately ${this.weightDifference ?? 0} kg ` +
        `would bring your current weight closer to the upper end of the general healthy BMI range.`;
      return;
    }

    this.status = 'Obesity';
    this.recommendationTitle = 'Consider gradual weight reduction';
    this.recommendationIcon = '↘';

    this.recommendation =
      `Your BMI is above the general adult healthy BMI range. ` +
      `A gradual reduction of approximately ${this.weightDifference ?? 0} kg ` +
      `would bring your current weight closer to the upper end of the general healthy BMI range.`;
  }

  get displayWeightDifference(): string {
    if (this.weightDifference === null) {
      return '0';
    }

    return this.convertWeightForDisplay(this.weightDifference);
  }

  get displayHealthyMinWeight(): string {
    if (this.healthyMinWeight === null) {
      return '0';
    }

    return this.convertWeightForDisplay(this.healthyMinWeight);
  }

  get displayHealthyMaxWeight(): string {
    if (this.healthyMaxWeight === null) {
      return '0';
    }

    return this.convertWeightForDisplay(this.healthyMaxWeight);
  }

  get displayCurrentWeight(): string {
    if (this.weightInKg === null) {
      return '0';
    }

    return this.convertWeightForDisplay(this.weightInKg);
  }

  private convertWeightForDisplay(weightKg: number): string {
    if (this.weightUnit === 'lb') {
      return (weightKg * 2.2046226218).toFixed(1);
    }

    return weightKg.toFixed(1);
  }

  get displayWeightUnit(): string {
    return this.weightUnit;
  }

  get recommendationClass(): string {
    if (this.bmi === null) {
      return '';
    }

    if (this.bmi < 18.5) {
      return 'underweight';
    }

    if (this.bmi < 25) {
      return 'normal';
    }

    if (this.bmi < 30) {
      return 'overweight';
    }

    return 'obesity';
  }

  reset(): void {
    this.heightUnit = 'cm';
    this.weightUnit = 'kg';

    this.height = null;
    this.feet = null;
    this.inches = null;
    this.weight = null;

    this.clearResult();
  }

  private clearResult(): void {
    this.bmi = null;
    this.status = '';

    this.heightInCm = null;
    this.weightInKg = null;

    this.healthyMinWeight = null;
    this.healthyMaxWeight = null;

    this.weightDifference = null;

    this.recommendation = '';
    this.recommendationTitle = '';
    this.recommendationIcon = '';
  }
}
