/**
 * Root component of the Angular application.
 * This component serves as the entry point for rendering the application.
 */

import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

/**
 * Root component definition.
 * 
 * - Uses `RouterOutlet` to display routed components.
 * - Imports `CommonModule` for common Angular directives.
 * - Declared as a **standalone component** to simplify module management.
 */
@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss',
})
export class AppComponent {
  /**
   * Application title.
   * This value is not actively used in the template but can be modified for branding purposes.
   */
  title = 'join';
}
