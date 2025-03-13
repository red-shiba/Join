/**
 * SignupComponent - Handles user registration functionality.
 * 
 * This component allows users to register an account, validate input fields, 
 * and submit the registration form using Firebase Authentication.
 */

import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from './../firebase-service/auth.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { trigger, state, style, transition, animate } from '@angular/animations';

/**
 * Signup form component.
 * 
 * Features:
 * - Validates user input (name, email, password).
 * - Handles user registration via Firebase Authentication.
 * - Displays success or error messages.
 * - Includes a password visibility toggle.
 * - Implements a fade-in animation for the signup form.
 */
@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, RouterLink, CommonModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss',
  animations: [
    trigger('fadeInUp', [
      state('hidden', style({
        opacity: 0,
        transform: 'translateY(100vh)',
      })),
      state('visible', style({
        opacity: 1,
        transform: 'translate(-50%, -50%)',
        top: '50%',
        left: '50%',
        position: 'fixed'
      })),
      transition('hidden => visible', [
        animate('1s ease-out')
      ])
    ])
  ]
})
export class SignupComponent {
  accept: boolean = false; // Whether the user has accepted the terms and conditions.
  authService = inject(AuthService); // Instance of the authentication service.
  constructor(private router: Router) {} // Router instance for navigation.
  emailPattern = '^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,4}$'; // Regex pattern used for validating email addresses, allowing uppercase letters.
  emailPatternError = 'Please enter a valid email address.'; // Error message for an invalid email pattern.
  isSuccess = false; // Indicates whether the registration was successful.
  showPassword = false; // Controls password visibility.

  /**
   * User input fields.
   */
  name = '';
  email = '';
  password = '';
  confirm = '';

  /**
   * Error messages for form validation.
   */
  nameError = '';
  emailError = '';
  passwordError = '';
  confirmError = '';
  acceptError = '';
  generalError = '';

  /**
   * Tracks whether form fields have been touched.
   */
  nameTouched = false;
  emailTouched = false;
  passwordTouched = false;

  /**
   * Registers a new user.
   * 
   * - Validates input fields.
   * - Calls Firebase authentication service for user registration.
   * - Updates the user's profile with their name.
   * - Redirects to the dashboard upon successful registration.
   * - Displays error messages if registration fails.
   */
  async register() {
    this.emailError = '';
    this.passwordError = '';
    this.generalError = '';

    if (!this.name) {
      this.nameError = 'Name is required.';
    }

    if (!this.email) {
      this.emailError = 'Email is required.';
    }

    if (!this.password) {
      this.passwordError = 'Password is required.';
    }

    if (this.password !== this.confirm) {
      this.confirmError = 'Passwords do not match.';
      return;
    }

    if (!this.name || !this.email || !this.password) {
      return;
    }

    if (!this.accept) {
      this.acceptError = 'Please accept the terms and conditions.';
      return;
    }
  
    try {
      const userCredential = await this.authService.register(this.name, this.email, this.password);
      if (userCredential.user) {
        await this.authService.updateProfile(userCredential.user, this.name);
      }

      this.isSuccess = true;

      setTimeout(() => {
        this.router.navigate(['/dashboard']);
      }, 2000);

    } catch (error: any) {
      alert(error.message);
    }
  }

  /**
   * Validates the email field.
   * 
   * - Ensures the field is not empty.
   * - Checks if the email follows the required pattern.
   */
  validateEmail() {
    this.emailError = '';
    if (!this.email) {
      this.emailError = 'Email is required.';
    }
    if (this.email && !this.email.match(this.emailPattern)) {
      this.emailError = this.emailPatternError;
    }
  }

  /**
   * Validates the password field.
   * 
   * Ensures the password field is not empty.
   */
  validatePassword() {
    this.passwordError = '';
    if (!this.password) {
      this.passwordError = 'Password is required.';
    }
  }

  /**
   * Validates the password confirmation field.
   * 
   * Ensures the passwords match.
   */
  validateConfirm() {
    this.confirmError = '';
    if (this.password !== this.confirm) {
      this.confirmError = 'Passwords do not match.';
    }
  }

  /**
   * Validates the name field.
   * 
   * Ensures the name field is not empty.
   */
  validateName() {
    this.nameError = '';
    if (!this.name) {
      this.nameError = 'Name is required.';
    }
  }

  /**
   * Toggles the visibility of the password field.
   */
  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}
