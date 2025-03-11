import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, RouterLink } from '@angular/router';
import { HeaderComponent } from '../shared/header/header.component';
import { NavbarComponent } from '../shared/navbar/navbar.component';

@Component({
  selector: 'app-shared-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterOutlet,
    HeaderComponent,
    NavbarComponent,
    RouterLink
  ],
  styleUrls: ['./login-navi-frame.component.scss'],
  templateUrl: './login-navi-frame.component.html',
})
export class LoginNaviFrameComponent {}

