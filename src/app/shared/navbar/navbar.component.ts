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
  isLegalRoute = false;
  isMainFrame = false;

  constructor(
    private location: Location,
    private router: Router
  ) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isLegalRoute = event.url.includes('legal');
        this.isMainFrame = event.url.includes('/board') || event.url.includes('/summary') || event.url.includes('/contacts') || event.url.includes('/add-task');
      }
    });
  }

  isActive(route: string): boolean {
    return this.location.path() === route;
  }
}
