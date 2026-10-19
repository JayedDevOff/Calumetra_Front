import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-jewellery',
  imports: [FormsModule,CommonModule],
  templateUrl: './jewellery.html',
  styleUrl: './jewellery.scss',
})
export class Jewellery {


calculationType = 'vori';

  vori = 0;
  gram = 0;

  pricePerVori = 0;
  pricePerGram = 0;

  totalPrice = 0;

  readonly VORI_TO_GRAM = 11.664;

  onTypeChange(): void {
    this.totalPrice = 0;
  }

  calculate(): void {

    if (this.calculationType === 'vori') {

      this.totalPrice =
        (Number(this.vori) || 0) *
        (Number(this.pricePerVori) || 0);

    } else {

      this.totalPrice =
        (Number(this.gram) || 0) *
        (Number(this.pricePerGram) || 0);
    }
  }
}


