import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; 
import { EditContactDialogComponent } from '../../../dialogs/edit-contact-dialog/edit-contact-dialog.component'; // Ensure this path is correct


@Component({
  selector: 'app-single-contact',
  standalone: true,
  imports: [FormsModule, CommonModule, EditContactDialogComponent], // Ensure this path is correct
  templateUrl: './single-contact.component.html',
  styleUrl: './single-contact.component.scss'
})
export class SingleContactComponent {
  @Input() contact: any;
  isDialogOpen = false;
  isEdit = false;
  edit = false;
  

  getInitials(name: string): string {
    if (!name) return '';
    return name
      .split(' ') // Name in Wörter splitten
      .map((word) => word[0]) // Erstes Zeichen jedes Wortes nehmen
      .join('') // Buchstaben zusammenfügen
      .toUpperCase(); // Großbuchstaben
  }

  openDialog() {
    console.log('Dialog wird geöffnet');
    this.isDialogOpen = true; // Öffnet das Dialogfenster
  }

  closeDialog(event: boolean) {
    console.log('Dialog wird geschlossen', event);
    this.isDialogOpen = false; // Schließt das Fenster, wenn das Event ausgelöst wird
  }
  
}
