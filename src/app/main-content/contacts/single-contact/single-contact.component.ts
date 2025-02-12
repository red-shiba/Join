import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-single-contact',
  standalone: true,
  imports: [ FormsModule, CommonModule],
  templateUrl: './single-contact.component.html',
  styleUrl: './single-contact.component.scss'
})
export class SingleContactComponent {
  @Input() contact: any;
  edit = false;

  getInitials(name: string): string {
    if (!name) return '';
    return name
      .split(' ') // Name in Wörter splitten
      .map((word) => word[0]) // Erstes Zeichen jedes Wortes nehmen
      .join('') // Buchstaben zusammenfügen
      .toUpperCase(); // Großbuchstaben
  }
}
