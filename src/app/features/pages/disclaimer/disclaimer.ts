import { ViewportScroller } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-disclaimer',
  imports: [ RouterLink ],
  templateUrl: './disclaimer.html',
  styleUrl: './disclaimer.scss',
})
export class Disclaimer implements OnInit {
  constructor(
    private viewportScroller: ViewportScroller,
    private router: Router,
  ) {
    //this.goToPrivacyPolicy();
  }

  ngOnInit(): void {
    setTimeout(() => {
      this.viewportScroller.scrollToPosition([0, 0], {
        behavior: 'smooth',
      });
    }, 50);
  }

  goToCookiePolicy(): void {
    this.router.navigate(['/disclaimer']).then(() => {
      setTimeout(() => {
        this.viewportScroller.scrollToPosition([0, 0], {
          behavior: 'smooth',
        });
      }, 50);
    });
  }
}
