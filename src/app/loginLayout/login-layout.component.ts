import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'app-login-layout',
  standalone: true,
  imports: [RouterOutlet, CommonModule],
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
        top: '80px',
        left: '77px',
        transform: 'translate(0, 0)',
        width: '100px',
        height: '120px'
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
  logoState: 'center' | 'moved' = 'center';

  ngOnInit() {
    setTimeout(() => {
      this.logoState = 'moved';
    }, 500);
  }
}



