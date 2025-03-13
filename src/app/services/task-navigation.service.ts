/**
 * TaskNavigationService - Handles navigation for adding tasks.
 * 
 * This service determines whether to navigate to the `/add-task` route 
 * or open a dialog based on the screen size.
 */

import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

/**
 * Provides task navigation functionality.
 * 
 * - **Navigates to the "Add Task" page** on small screens (width < 769px).
 * - **Opens a dialog instead** on larger screens if a dialog function is provided.
 */
@Injectable({
  providedIn: 'root',
})
export class TaskNavigationService {
  /**
   * Initializes the service with the Angular Router.
   * 
   * @param router - Router instance for navigation.
   */
  constructor(private router: Router) {}

  /**
   * Determines whether to navigate to the "Add Task" page or open a dialog.
   * 
   * - If the screen width is less than 769px, the user is navigated to `/add-task`.
   * - Otherwise, if a dialog function is provided, it is executed.
   * - If no dialog function is provided, a warning is logged.
   * 
   * @param type - The task type (used as a query parameter or for the dialog).
   * @param openDialogFn - Optional function to open a dialog instead of navigation.
   */
  navigateOrOpenDialog(type: string, openDialogFn?: (type: string) => void) {
    if (window.innerWidth < 769) {
      this.router.navigate(['/add-task'], { queryParams: { type } });
    } else {
      if (openDialogFn) {
        openDialogFn(type);
      } else {
        console.warn(
          'No dialog function provided. Screen width > 769px, doing nothing.'
        );
      }
    }
  }
}
