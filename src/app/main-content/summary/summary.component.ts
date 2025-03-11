import { Component, HostListener, OnInit } from '@angular/core';
import { AuthService } from '../../firebase-service/auth.service';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.scss',
  animations: [
    trigger('moveText', [
      state(
        'center',
        style({
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          opacity: 1,
          backgroundColor: 'gray',
        })
      ),
      state(
        'moved',
        style({
          top: '60px',
          left: '77px',
          transform: 'translate(0, 0)',
          opacity: 1,
          backgroundColor: 'transparent',
        })
      ),
      transition('center => moved', animate('0.5s ease-in-out')),
    ]),
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('1s ease-in-out', style({ opacity: 1 })),
      ]),
    ]),
  ],
})
export class SummaryComponent implements OnInit {
  displayName: string | null = '';
  greeting: string = '';
  textState: 'center' | 'moved' = 'center';
  isMobileView: boolean = false;

  constructor(private authService: AuthService) {}

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.displayName = user.displayName;
    }
    this.greeting = this.getGreeting();

    // Initiale Überprüfung der Bildschirmgröße
    this.checkScreenWidth();

    // Automatisches Verschieben nach kurzer Verzögerung (nur im mobilen Bereich)
    if (this.isMobileView) {
      setTimeout(() => {
        this.textState = 'moved';
      }, 1000);
    }
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: Event) {
    this.checkScreenWidth();
  }

  checkScreenWidth() {
    this.isMobileView = window.innerWidth >= 320 && window.innerWidth <= 768;
    if (!this.isMobileView) {
      this.textState = 'moved'; // Direkt in den Endzustand versetzen, wenn nicht im mobilen Bereich
    }
  }

  getGreeting(): string {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) {
      return 'Good Morning';
    } else if (hour >= 12 && hour < 18) {
      return 'Good Afternoon';
    } else {
      return 'Good Evening';
    }
  }
}
