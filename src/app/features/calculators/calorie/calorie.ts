import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators, ReactiveFormsModule } from '@angular/forms';
import { Seo } from '../../../core/services/seo';

@Component({
  selector: 'app-calorie',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './calorie.html',
  styleUrl: './calorie.scss',
})
export class Calorie implements OnInit {
  calorieForm: FormGroup;

  calculated = false;

  bmr = 0;
  tdee = 0;
  goalCalories = 0;

  scalePosition = 50;

  goalLabel = 'Maintenance';
  goalMessage = 'This is your estimated daily calorie target.';

  activities = [
    {
      value: 'sedentary',
      name: 'Sedentary',
      description: 'Little or no exercise',
      icon: '🪑',
      multiplier: 1.2,
    },
    {
      value: 'light',
      name: 'Lightly Active',
      description: 'Exercise 1–3 days/week',
      icon: '🚶',
      multiplier: 1.375,
    },
    {
      value: 'moderate',
      name: 'Moderately Active',
      description: 'Exercise 3–5 days/week',
      icon: '🏃',
      multiplier: 1.55,
    },
    {
      value: 'active',
      name: 'Very Active',
      description: 'Exercise 6–7 days/week',
      icon: '🏋️',
      multiplier: 1.725,
    },
    {
      value: 'extra',
      name: 'Extra Active',
      description: 'Hard training or physical job',
      icon: '🔥',
      multiplier: 1.9,
    },
  ];

  constructor(
    private fb: FormBuilder,
    private seo: Seo,
  ) {
    this.calorieForm = this.fb.group({
      age: [25, [Validators.required, Validators.min(1), Validators.max(120)]],
      gender: ['male', Validators.required],
      height: [170, [Validators.required, Validators.min(50), Validators.max(250)]],
      weight: [70, [Validators.required, Validators.min(20), Validators.max(300)]],
      activity: ['moderate', Validators.required],
      goal: ['maintain', Validators.required],
    });
  }

  ngOnInit(): void {
    this.seo.setPage('calorieCalculator');
  }

  setGender(gender: string): void {
    this.calorieForm.patchValue({
      gender,
    });
  }

  setActivity(activity: string): void {
    this.calorieForm.patchValue({
      activity,
    });
  }

  setGoal(goal: string): void {
    this.calorieForm.patchValue({
      goal,
    });
  }

  calculateCalories(): void {
    if (this.calorieForm.invalid) {
      this.calorieForm.markAllAsTouched();
      return;
    }

    const age = Number(this.calorieForm.value.age);
    const height = Number(this.calorieForm.value.height);
    const weight = Number(this.calorieForm.value.weight);
    const gender = this.calorieForm.value.gender;
    const activityValue = this.calorieForm.value.activity;
    const goal = this.calorieForm.value.goal;

    if (gender === 'male') {
      this.bmr = 10 * weight + 6.25 * height - 5 * age + 5;
    } else {
      this.bmr = 10 * weight + 6.25 * height - 5 * age - 161;
    }

    const activity = this.activities.find((item) => item.value === activityValue);

    const multiplier = activity ? activity.multiplier : 1.2;

    this.tdee = this.bmr * multiplier;

    if (goal === 'lose') {
      this.goalCalories = this.tdee - 500;
      this.goalLabel = 'Weight Loss';
      this.goalMessage = 'A moderate calorie deficit can support gradual weight loss.';
      this.scalePosition = 25;
    } else if (goal === 'gain') {
      this.goalCalories = this.tdee + 300;
      this.goalLabel = 'Weight Gain';
      this.goalMessage = 'A moderate calorie surplus can support gradual weight gain.';
      this.scalePosition = 75;
    } else {
      this.goalCalories = this.tdee;
      this.goalLabel = 'Maintenance';
      this.goalMessage = 'This is your estimated daily calorie target for maintaining your weight.';
      this.scalePosition = 50;
    }

    this.bmr = Math.round(this.bmr);
    this.tdee = Math.round(this.tdee);
    this.goalCalories = Math.max(1200, Math.round(this.goalCalories));

    this.calculated = true;

    setTimeout(() => {
      document.querySelector('.result-card')?.scrollIntoView({
        behavior: 'smooth',
        block: 'start',
      });
    }, 100);
  }

  isInvalid(controlName: string): boolean {
    const control = this.calorieForm.get(controlName);

    return !!(control && control.invalid && (control.touched || control.dirty));
  }
}
