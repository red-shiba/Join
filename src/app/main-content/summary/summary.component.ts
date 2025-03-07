import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../firebase-service/auth.service';

@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.scss'
})
export class SummaryComponent implements OnInit {
  displayName: string | null = '';

  constructor(private authService: AuthService) {}

  ngOnInit() {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.displayName = user.displayName;
    }
  }
}
