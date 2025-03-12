import { Component, inject } from '@angular/core';
import { AuthService } from './../firebase-service/auth.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [FormsModule, CommonModule]
})
export class LoginComponent {

  constructor(private router: Router) {}

  authService = inject(AuthService);
  email = '';
  password = '';
  emailError = '';
  passwordError = '';
  generalError = '';
  emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$';
  emailPatternError = 'Please enter a valid email address.';
  emailTouched = false;
  passwordTouched = false;
  showPassword = false;

  async login() {
    this.emailError = '';
    this.passwordError = '';
    this.generalError = '';

    if (!this.email) {
      this.emailError = 'Email is required.';
    }
    if (!this.password) {
      this.passwordError = 'Password is required.';
    }
    if (this.emailError || this.passwordError) {
      return;
    }

    try {
      await this.authService.login(this.email, this.password);
      await firstValueFrom(this.authService.isLoggedIn$());
    
      this.router.navigate(['/summary']);
    } catch (error: any) {
      this.generalError = error.message;
    }
  }

  guestLogin() {
    this.email = 'michaelspari@gmx.de';
    this.password = 'gast123';
  }

  validateEmail() {
    this.emailError = '';
    if (!this.email) {
      this.emailError = 'Email is required.';
    }
    if (this.email && !this.email.match(this.emailPattern)) {
      this.emailError = this.emailPatternError;
    }
  }

  validatePassword() {
    this.passwordError = '';
    if (!this.password) {
      this.passwordError = 'Password is required.';
    }
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }
}


