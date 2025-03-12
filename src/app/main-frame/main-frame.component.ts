import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet, RouterLink } from '@angular/router';
import { HeaderComponent } from './../shared/header/header.component';
import { NavbarComponent } from './../shared/navbar/navbar.component';

@Component({
  selector: 'app-main-frame',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    NavbarComponent,
    RouterLink,
  ],
  templateUrl: './main-frame.component.html',
  styleUrl: './main-frame.component.scss',
})
export class MainFrameComponent {
  constructor(private router: Router) {}

  // Prüft ob die Route aktiv ist
  isActive(route: string): boolean {
    return this.router.isActive(route, true);
  }
}
