/**
 * NavbarComponent - Handles navigation visibility and active state detection.
 * 
 * This component dynamically adjusts the navbar display based on the current route.
 * It determines whether the navigation belongs to the login frame or the main content area.
 */

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Location } from '@angular/common';
import { Router, NavigationEnd } from '@angular/router';

/**
 * Navbar component.
 * 
 * - **Determines navbar visibility** based on the current route.
 * - **Tracks active routes** to highlight selected navigation links.
 */
@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink, CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss',
})
export class NavbarComponent {
  /**
   * Indicates whether the navbar belongs to the login navigation frame.
   * This is `true` for routes under `/legal`.
   */
  isLoginNaviFrame = false;

  /**
   * Indicates whether the navbar belongs to the main content area.
   * This is `true` for routes such as `/board`, `/summary`, `/contacts`, etc.
   */
  isMainContent = false;

  /**
   * Constructor that initializes the router subscription to track navigation changes.
   * 
   * @param location - Service to track the current browser URL.
   * @param router - Router instance to listen for navigation changes.
   */
  constructor(
    private location: Location,
    private router: Router
  ) {
    // Subscribe to router events to detect when navigation ends.
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        const url = event.urlAfterRedirects;

        // Check if the route belongs to the login navigation frame (legal section).
        this.isLoginNaviFrame = url.startsWith('/legal');

        // Check if the route belongs to the main content section.
        this.isMainContent = 
          url.startsWith('/board') ||
          url.startsWith('/summary') ||
          url.startsWith('/contacts') ||
          url.startsWith('/add-task') ||
          url.startsWith('/helpsection') ||
          url.startsWith('/privacypolicy') || 
          url.startsWith('/legalnotice');
      }
    });
  }

  /**
   * Checks if a given route is currently active.
   * 
   * @param route - The route to check.
   * @returns `true` if the given route matches the current location path, otherwise `false`.
   */
  isActive(route: string): boolean {
    return this.location.path() === route;
  }
}
