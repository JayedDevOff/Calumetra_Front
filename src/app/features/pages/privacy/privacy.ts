import { ViewportScroller } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-privacy',
  imports: [RouterLink],
  templateUrl: './privacy.html',
  styleUrl: './privacy.scss',
})
export class Privacy implements OnInit {
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
    this.router.navigate(['/privacy-policy']).then(() => {
      setTimeout(() => {
        this.viewportScroller.scrollToPosition([0, 0], {
          behavior: 'smooth',
        });
      }, 50);
    });
  }
}
