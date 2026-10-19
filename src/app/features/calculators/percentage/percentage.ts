import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-percentage',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './percentage.html',
  styleUrl: './percentage.scss',
})
export class Percentage {
  percentageForm: FormGroup;

  resultOne = 0;
  resultTwo = 0;
  resultThree = 0;

  calculated = false;

  constructor(private fb: FormBuilder) {
    this.percentageForm = this.fb.group({
      percentage: [10, [Validators.required, Validators.min(0)]],
      value: [200, [Validators.required, Validators.min(0)]],
      part: [50, [Validators.required, Validators.min(0)]],
      whole: [200, [Validators.required, Validators.min(0.01)]],
      oldValue: [100, [Validators.required, Validators.min(0)]],
      newValue: [150, [Validators.required, Validators.min(0)]],
    });
  }

  calculatePercentage(): void {
    if (this.percentageForm.invalid) {
      this.percentageForm.markAllAsTouched();
      return;
    }

    const percentage = Number(this.percentageForm.get('percentage')?.value);
    const value = Number(this.percentageForm.get('value')?.value);
    const part = Number(this.percentageForm.get('part')?.value);
    const whole = Number(this.percentageForm.get('whole')?.value);
    const oldValue = Number(this.percentageForm.get('oldValue')?.value);
    const newValue = Number(this.percentageForm.get('newValue')?.value);

    this.resultOne = (percentage / 100) * value;

    this.resultTwo = whole > 0 ? (part / whole) * 100 : 0;

    this.resultThree = oldValue > 0 ? ((newValue - oldValue) / oldValue) * 100 : 0;

    this.calculated = true;
  }

  isInvalid(controlName: string): boolean {
    const control = this.percentageForm.get(controlName);

    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  get firstPercentageLabel(): string {
    const value = this.percentageForm.get('percentage')?.value;
    return `${value || 0}%`;
  }

  get secondPercentageLabel(): string {
    return `${this.resultTwo.toFixed(1)}%`;
  }

  get changeLabel(): string {
    if (this.resultThree > 0) {
      return 'Increase';
    }

    if (this.resultThree < 0) {
      return 'Decrease';
    }

    return 'No Change';
  }
}
