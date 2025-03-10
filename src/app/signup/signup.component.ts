import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from './../firebase-service/auth.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';
import { trigger, state, style, transition, animate } from '@angular/animations';

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
accept: boolean = false;

  constructor(private router: Router) {}

  authService = inject(AuthService);
  name = '';
  email = '';
  password = '';
  confirm = '';
  nameError = '';
  emailError = '';
  passwordError = '';
  generalError = '';
  emailPattern = '^[a-z0-9._%+-]+@[a-z0-9.-]+\.[a-z]{2,4}$';
  emailPatternError = 'Please enter a valid email address.';
  emailTouched = false;
  passwordTouched = false;
  confirmError = '';
  isSuccess = false;

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
      alert('Passwörter stimmen nicht überein!');
      return;
    }

    if (!this.name || !this.email || !this.password) {
      alert('Bitte füllen Sie alle Felder aus!');
      return;
    }

    if (this.accept === false) {
      alert ('Bitte akzeptieren Sie die Nutzungsbedingungen!');
      return;
    }
  
    try {
      const userCredential = await this.authService.register(this.name, this.email, this.password);
      if (userCredential.user) {
        await this.authService.updateProfile(userCredential.user, this.name);
      }

      this.isSuccess = true; // Animation starten

      setTimeout(() => {
        this.router.navigate(['/dashboard']);
      }, 2000);

    } catch (error: any) {
      alert(error.message);
    }
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

  validateConfirm() {
    this.confirmError = '';
    if (this.password !== this.confirm) {
      this.confirmError = 'Passwords do not match.';
    }
  }

  validateName() {
    this.nameError = '';
    if (!this.name) {
      this.nameError = 'Name is required.';
    }
  }

}
