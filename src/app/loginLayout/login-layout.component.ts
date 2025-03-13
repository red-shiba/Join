/**
 * LoginLayoutComponent - Manages the layout and animations for the login and signup views.
 *
 * This component provides:
 * - A dynamic logo animation that moves from the center of the screen to the top-left corner.
 * - An animation that fades in the underlying router views.
 * - A route check to determine if the current page is the signup page.
 */
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink, Router, NavigationEnd } from '@angular/router';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-login-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  templateUrl: './login-layout.component.html',
  styleUrls: ['./login-layout.component.scss'],
  animations: [
    /**
     * moveLogo animation:
     * - Transitions the logo from the center of the screen to the top-left corner.
     * - Used to emphasize an initial branding focus, then shift it upon navigation or after a delay.
     */
    trigger('moveLogo', [
      state('center', style({
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '200px',
        height: '240px'
      })),
      state('moved', style({
        top: '35px',
        left: '35px',
        transform: 'translate(0, 0)',
        width: '90px',
        height: '108px'
      })),
      transition('center => moved', animate('0.5s ease-in-out'))
    ]),
    /**
     * fadeIn animation:
     * - Fades the view in over 1 second when the route first loads.
     */
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('1s ease-in-out', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class LoginLayoutComponent {
  /**
   * Indicates if the current route contains 'signup'. Used to conditionally display signup-related UI.
   */
  isSignupRoute = false;

  /**
   * Tracks the logo's animation state (e.g., 'center' or 'moved').
   */
  logoState: 'center' | 'moved' = 'center';

  /**
   * Subscribes to router events and updates `isSignupRoute` based on the URL.
   * 
   * @param router - The Angular Router for navigation and event subscription.
   */
  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isSignupRoute = event.url.includes('signup');
      }
    });
  }

  /**
   * Lifecycle hook that triggers the logo animation to move after a brief delay.
   */
  ngOnInit() {
    setTimeout(() => {
      this.logoState = 'moved';
    }, 500);
  }
}
