import { Component } from '@angular/core';

@Component({
  selector: 'app-help-section',
  standalone: true,
  imports: [],
  templateUrl: './help-section.component.html',
  styleUrl: './help-section.component.scss'
})
export class HelpSectionComponent {
  goBack() {
    window.history.back();
  }
}
