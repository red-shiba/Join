/**
 * PrivacyPolicyComponent - Displays the privacy policy of the application.
 * 
 * This component provides information about data protection and user privacy.
 * It also includes a function to navigate back to the previous page.
 */

import { Component } from '@angular/core';

/**
 * Privacy Policy component.
 * 
 * - **Standalone component** with no external dependencies.
 * - **Displays privacy policy content** from `privacy-policy.component.html`.
 * - **Provides a back navigation function** for user convenience.
 */
@Component({
  selector: 'app-privacy-policy',
  standalone: true,
  imports: [],
  templateUrl: './privacy-policy.component.html',
  styleUrl: './privacy-policy.component.scss'
})
export class PrivacyPolicyComponent {
  /**
   * Navigates the user back to the previous page.
   * Uses the browser's history API to return to the last visited page.
   */
  goBack() {
    window.history.back();
  }
}
