/**
 * LegalNoticeComponent - Displays the legal notice (imprint) of the application.
 * 
 * This component provides legal information required by law, such as company details 
 * and contact information. It also includes a function to navigate back to the previous page.
 */

import { Component } from '@angular/core';

/**
 * Legal Notice component.
 * 
 * - **Standalone component** with no external dependencies.
 * - **Displays legal notice content** from `legal-notice.component.html`.
 * - **Provides a back navigation function** for user convenience.
 */
@Component({
  selector: 'app-legal-notice',
  standalone: true,
  imports: [],
  templateUrl: './legal-notice.component.html',
  styleUrl: './legal-notice.component.scss'
})
export class LegalNoticeComponent {
  /**
   * Navigates the user back to the previous page.
   * Uses the browser's history API to return to the last visited page.
   */
  goBack() {
    window.history.back();
  }
}
