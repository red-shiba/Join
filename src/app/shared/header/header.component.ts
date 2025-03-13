import { Component, OnInit, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from './../../firebase-service/auth.service';
import { Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule, RouterLink],
  imports: [CommonModule, RouterLink],
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.scss'],
})
export class HeaderComponent implements OnInit {
  displayName: string | null = '';
  isDropdownOpen = false;
  isMobileView = false; // <--- Neue Property

  constructor(private authService: AuthService, private router: Router) {}

  // Prüfe bei Fenster-Resize die Breite:
  @HostListener('window:resize')
  onResize() {
    this.isMobileView = window.innerWidth < 769;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    const targetElement = event.target as HTMLElement;
    if (
      !targetElement.closest('.user-badge') &&
      !targetElement.closest('.dropdown-menu')
    ) {
      this.isDropdownOpen = false;
    }
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  logout() {
    this.authService.logout().then(() => {
      this.router.navigate(['/login']);
      this.isDropdownOpen = false;
    });
  }

  ngOnInit() {
    this.isMobileView = window.innerWidth < 769;

    const user = this.authService.getCurrentUser();
    if (user && user.displayName) {
      this.displayName = this.getInitials(user.displayName);
    }
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase();
  }
}
