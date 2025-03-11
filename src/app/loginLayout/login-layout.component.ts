import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { RouterLink } from '@angular/router';
import { Router, NavigationEnd } from '@angular/router';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-login-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink, CommonModule],
  templateUrl: './login-layout.component.html',
  styleUrls: ['./login-layout.component.scss'],
  animations: [
    trigger('moveLogo', [
      state('center', style({
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '200px',
        height: '240px'
      })),
      state('moved', style({
        top: '35px',
        left: '35px',
        transform: 'translate(0, 0)',
        width: '90px',
        height: '108px'
      })),
      transition('center => moved', animate('0.5s ease-in-out'))
    ]),
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('1s ease-in-out', style({ opacity: 1 }))
      ])
    ])
  ]
})
export class LoginLayoutComponent {
  isSignupRoute = false;
  logoState: 'center' | 'moved' = 'center';

  constructor(private router: Router) {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        this.isSignupRoute = event.url.includes('signup');
      }
    });
  }

  ngOnInit() {
    setTimeout(() => {
      this.logoState = 'moved';
    }, 500);
  }
}



