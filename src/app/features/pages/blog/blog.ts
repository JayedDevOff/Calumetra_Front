import { ViewportScroller } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-blog',
  imports: [RouterLink],
  templateUrl: './blog.html',
  styleUrl: './blog.scss',
})
export class Blog implements OnInit {
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
    this.router.navigate(['/blog']).then(() => {
      setTimeout(() => {
        this.viewportScroller.scrollToPosition([0, 0], {
          behavior: 'smooth',
        });
      }, 50);
    });
  }
}
