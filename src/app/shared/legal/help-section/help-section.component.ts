/**
 * HelpSectionComponent - Displays the help section of the application.
 * 
 * This component provides users with guidance and support information 
 * related to the application's features and functionality.
 * It also includes a function to navigate back to the previous page.
 */

import { Component } from '@angular/core';

/**
 * Help Section component.
 * 
 * - **Standalone component** with no external dependencies.
 * - **Displays help content** from `help-section.component.html`.
 * - **Provides a back navigation function** for user convenience.
 */
@Component({
  selector: 'app-help-section',
  standalone: true,
  imports: [],
  templateUrl: './help-section.component.html',
  styleUrl: './help-section.component.scss'
})
export class HelpSectionComponent {
  /**
   * Navigates the user back to the previous page.
   * Uses the browser's history API to return to the last visited page.
   */
  goBack() {
    window.history.back();
  }
}
