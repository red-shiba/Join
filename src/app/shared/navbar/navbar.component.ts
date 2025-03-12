import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Location } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  isLoginNaviFrame = false;
  isMainContent = false;

  constructor(
    private location: Location,
    private router: Router
  ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const url = event.urlAfterRedirects;
        this.isLoginNaviFrame = 
        url.startsWith('/legal');

        this.isMainContent = 
        url.startsWith('/board') ||
        url.startsWith('/summary') ||
        url.startsWith('/contacts') ||
        url.startsWith('/add-task') ||
        url.startsWith('/helpsection') ||
        url.startsWith('/privacypolicy')|| 
        url.startsWith('/legalnotice');
      }
    });
  }
  isActive(route: string): boolean {
    return this.location.path() === route;
  }
}
