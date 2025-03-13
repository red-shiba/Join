/**
 * Authentication Guard to protect routes from unauthorized access.
 * Ensures that only authenticated users can access specific routes.
 */

import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from './firebase-service/auth.service';
import { firstValueFrom } from 'rxjs';

/**
 * Authentication guard function that determines whether a user is allowed to access a route.
 * 
 * @returns {Promise<boolean>} Returns `true` if the user is authenticated, otherwise redirects to `/login` and returns `false`.
 */
export const authGuard: CanActivateFn = async () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Asynchronously check if the user is logged in
  const isLoggedIn = await firstValueFrom(authService.isLoggedIn$());

  if (isLoggedIn) {
    return true; // Allow access to the route
  } else {
    router.navigate(['/login']); // Redirect unauthorized users to the login page
    return false; // Deny access to the route
  }
};
