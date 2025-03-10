import { Component, OnInit } from '@angular/core';
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
        })
      ),
      state(
        'moved',
        style({
          top: '60px',
          left: '77px',
          transform: 'translate(0, 0)',
          opacity: 1,
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
  constructor(private authService: AuthService) {}

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.displayName = user.displayName;
    }
    this.greeting = this.getGreeting();

    // Automatisches Verschieben nach kurzer Verzögerung
    setTimeout(() => {
      this.textState = 'moved';
    }, 1000);
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
