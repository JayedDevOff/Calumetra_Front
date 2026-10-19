import { ViewportScroller } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-terms',
  imports: [RouterLink],
  templateUrl: './terms.html',
  styleUrl: './terms.scss',
})
export class Terms implements OnInit {
  ngOnInit(): void {
    setTimeout(() => {
      this.viewportScroller.scrollToPosition([0, 0], {
        behavior: 'smooth',
      });
    }, 50);
  }
  constructor(
    private viewportScroller: ViewportScroller,
    private router: Router,
  ) {
    //this.goToPrivacyPolicy();
  }

  goToPrivacyPolicy() {
    this.router.navigate(['/terms']).then(() => {
      setTimeout(() => {
        this.viewportScroller.scrollToPosition([0, 0], {
          behavior: 'smooth',
        });
      }, 50);
    });
  }
}
