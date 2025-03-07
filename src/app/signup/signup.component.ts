import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from './../firebase-service/auth.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [FormsModule, RouterLink, CommonModule],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.scss'
})
export class SignupComponent {
accept: boolean = false;

  constructor(private router: Router) {}

  authService = inject(AuthService);
  name = '';
  email = '';
  password = '';
  confirm = '';

  async register() {
    if (this.password !== this.confirm) {
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
      
      // Firebase-Profil aktualisieren
      if (userCredential.user) {
        await this.authService.updateProfile(userCredential.user, this.name);
      }
  
      alert('Registrierung erfolgreich!');
      this.router.navigate(['/dashboard']);
    } catch (error: any) {
      alert(error.message);
    }
  }

}
