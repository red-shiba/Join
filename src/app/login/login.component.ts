import { Component, inject } from '@angular/core';
import { AuthService } from './../firebase-service/auth.service';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { firstValueFrom } from 'rxjs';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  imports: [FormsModule]
})
export class LoginComponent {

  constructor(private router: Router) {}

  authService = inject(AuthService);
  email = '';
  password = '';

  async login() {
    try {
      await this.authService.login(this.email, this.password);
      
      // Warte, bis Firebase bestätigt, dass der User eingeloggt ist
      await firstValueFrom(this.authService.isLoggedIn$());
      
      alert('Login erfolgreich!');
      this.router.navigate(['/board']); // Weiterleitung zur Haupt-App
    } catch (error: any) {
      alert(error.message);
    }
  }

  async register() {
    try {
      await this.authService.register(this.email, this.password);
      alert('Registrierung erfolgreich!');
    } catch (error: any) {
      alert(error.message);
    }
  }

  guestLogin() {
    this.email = 'gast@gast.de';
    this.password = 'gast789';
  }
}


