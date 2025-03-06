import { Component, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from './../../firebase-service/auth.service'; // Dein AuthService importieren
import { Router } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.component.html',
  styleUrl: './header.component.scss',
})
export class HeaderComponent {
  isDropdownOpen = false;

  constructor(private authService: AuthService, private router: Router) {}

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    const targetElement = event.target as HTMLElement;
    if (!targetElement.closest('.user-badge') && !targetElement.closest('.dropdown-menu')) {
      this.isDropdownOpen = false;
    }
  }

  // Logout-Funktion
  logout() {
    this.authService.logout().then(() => {
      this.router.navigate(['/login']); // Nach dem Logout auf die Login-Seite weiterleiten
      this.isDropdownOpen = false; // Dropdown-Menü schließen
    });
  }
}
