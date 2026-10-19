import { ViewportScroller } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-contact',
  imports: [RouterLink],
  templateUrl: './contact.html',
  styleUrl: './contact.scss',
})
export class Contact implements OnInit {
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
    this.router.navigate(['/contact']).then(() => {
      setTimeout(() => {
        this.viewportScroller.scrollToPosition([0, 0], {
          behavior: 'smooth',
        });
      }, 50);
    });
  }
}
