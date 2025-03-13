/**
 * MainFrameComponent - Serves as the main layout for the application.
 * 
 * This component acts as a container for the application's primary sections, 
 * including the header, navbar, and router outlet for displaying views.
 */

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, RouterLink } from '@angular/router';
import { HeaderComponent } from './../shared/header/header.component';
import { NavbarComponent } from './../shared/navbar/navbar.component';

/**
 * Main frame component.
 * 
 * - **Provides the primary layout** for the application.
 * - **Includes shared UI elements** such as the header and navbar.
 * - **Hosts the router outlet** for displaying different views.
 */
@Component({
  selector: 'app-main-frame',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    NavbarComponent,
    RouterLink,
  ],
  templateUrl: './main-frame.component.html',
  styleUrl: './main-frame.component.scss',
})
export class MainFrameComponent {
  /**
   * Initializes the component with the router instance.
   * 
   * @param router - The Angular Router service for navigation.
   */
  constructor(private router: Router) {}

  /**
   * Checks if a given route is currently active.
   * 
   * @param route - The route to check.
   * @returns `true` if the specified route is active, otherwise `false`.
   */
  isActive(route: string): boolean {
    return this.router.isActive(route, true);
  }
}
