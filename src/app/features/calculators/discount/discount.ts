
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
  selector: 'app-discount-calculator',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './discount.html',
  styleUrl: './discount.scss',
})
export class Discount implements OnInit {

  discountForm: FormGroup;

  calculated = false;

  originalPrice = 0;
  discountRate = 0;
  discountAmount = 0;
  priceAfterDiscount = 0;

  addVat = false;
  vatRate = 0;
  vatAmount = 0;

  finalPrice = 0;

  constructor(
    private fb: FormBuilder,
    private seo: Seo,
  ) {
    this.discountForm = this.fb.group({
      originalPrice: [
        2000,
        [Validators.required, Validators.min(0.01)],
      ],

      discountRate: [
        20,
        [Validators.required, Validators.min(0), Validators.max(100)],
      ],

      addVat: [
        true,
      ],

      vatRate: [
        5,
        [Validators.min(0), Validators.max(100)],
      ],
    });
  }


  ngOnInit(): void {
    this.seo.setPage('discountCalculator');

    this.discountForm
      .get('addVat')
      ?.valueChanges
      .subscribe((enabled) => {

        const vatControl = this.discountForm.get('vatRate');

        if (enabled) {
          vatControl?.setValidators([
            Validators.required,
            Validators.min(0),
            Validators.max(100),
          ]);
        } else {
          vatControl?.clearValidators();
        }

        vatControl?.updateValueAndValidity();
      });
  }


  calculateDiscount(): void {

    if (this.discountForm.invalid) {
      this.discountForm.markAllAsTouched();
      return;
    }

    const {
      originalPrice = 0,
      discountRate = 0,
      addVat = false,
      vatRate = 0,
    } = this.discountForm.getRawValue();


    this.originalPrice = Number(originalPrice);
    this.discountRate = Number(discountRate);
    this.addVat = Boolean(addVat);
    this.vatRate = this.addVat ? Number(vatRate) : 0;


    // Discount
    this.discountAmount =
      this.originalPrice *
      (this.discountRate / 100);


    // Price after discount
    this.priceAfterDiscount =
      this.originalPrice -
      this.discountAmount;


    // VAT
    this.vatAmount = this.addVat
      ? this.priceAfterDiscount *
        (this.vatRate / 100)
      : 0;


    // Final price
    this.finalPrice =
      this.priceAfterDiscount +
      this.vatAmount;


    this.calculated = true;

    this.scrollToResult();
  }


  isInvalid(name: string): boolean {

    const control = this.discountForm.get(name);

    return !!(
      control?.invalid &&
      (control.touched || control.dirty)
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

