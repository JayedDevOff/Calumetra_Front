import { AfterViewInit, Component, signal } from '@angular/core';
import { NavigationCancel, NavigationEnd, NavigationError, NavigationStart, Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  templateUrl: './app.html',
  styleUrl: './app.scss',
})
export class App  {
  protected readonly title = signal('calumetra');

 constructor(private router: Router) {
   this.router.events.subscribe(event => 
    { const loader = document.getElementById('initial-loader');
       if (!loader) return; if (event instanceof NavigationStart) 
        { loader.classList.remove('hide'); } 
       if ( event instanceof NavigationEnd || event instanceof NavigationCancel || event instanceof NavigationError ) 
        { setTimeout(() => { loader.classList.add('hide'); }, 300); } }); 
      }






}
