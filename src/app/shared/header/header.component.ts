/**
 * HeaderComponent - Manages the application's header section.
 * 
 * This component displays the user's profile, handles navigation, 
 * and controls the visibility of the dropdown menu.
 */

import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from './../../firebase-service/auth.service';
import { Router, RouterLink } from '@angular/router';

/**
 * Header component.
 * 
 * - Displays the user's name or initials.
 * - Provides a dropdown menu for navigation.
 * - Handles logout functionality.
 * - Adjusts the UI for mobile and desktop views.
 */
@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  imports: [CommonModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  /**
   * The display name or initials of the logged-in user.
   */
  displayName: string | null = '';

  /**
   * Indicates whether the dropdown menu is open.
   */
  isDropdownOpen = false;

  /**
   * Indicates whether the application is in mobile view mode (width < 769px).
   */
  isMobileView = false;

  /**
   * Initializes the component with authentication and routing services.
   * 
   * @param authService - Authentication service instance.
   * @param router - Router instance for navigation.
   */
  constructor(private authService: AuthService, private router: Router) {}

  /**
   * Listens for window resize events to adjust the mobile view state.
   */
  @HostListener('window:resize')
  onResize() {
    this.isMobileView = window.innerWidth < 769;
  }

  /**
   * Listens for document clicks to close the dropdown menu 
   * when clicking outside of the user badge or dropdown menu.
   * 
   * @param event - The click event.
   */
  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    const targetElement = event.target as HTMLElement;
    if (
      !targetElement.closest('.user-badge') &&
      !targetElement.closest('.dropdown-menu')
    ) {
      this.isDropdownOpen = false;
    }
  }

  /**
   * Toggles the visibility of the dropdown menu.
   */
  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  /**
   * Logs the user out and redirects to the login page.
   * Closes the dropdown menu after logging out.
   */
  logout() {
    this.authService.logout().then(() => {
      this.router.navigate(['/login']);
      this.isDropdownOpen = false;
    });
  }

  /**
   * Initializes the component by determining the current screen size 
   * and setting the display name of the user.
   */
  ngOnInit() {
    this.isMobileView = window.innerWidth < 769;

    const user = this.authService.getCurrentUser();
    if (user && user.displayName) {
      this.displayName = this.getInitials(user.displayName);
    }
  }

  /**
   * Converts the user's name into initials.
   * 
   * @param name - The full name of the user.
   * @returns The initials in uppercase.
   */
  getInitials(name: string): string {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  }
}
