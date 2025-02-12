import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common'; 
import { EditContactDialogComponent } from '../../../dialogs/edit-contact-dialog/edit-contact-dialog.component';

@Component({
  selector: 'app-single-contact',
  standalone: true,
  imports: [FormsModule, CommonModule, EditContactDialogComponent],
  templateUrl: './single-contact.component.html',
  styleUrl: './single-contact.component.scss',
})
export class SingleContactComponent {
  @Input() contact: any;
  isDialogOpen = false;
  selectedContact: any = null;  // Neuer State für das ausgewählte Kontaktobjekt

  getInitials(name: string): string {
    if (!name) return '';
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase();
  }

  openDialog() {
    console.log('Dialog wird geöffnet');
    this.selectedContact = { ...this.contact };  // Kopie des Kontakts erstellen
    this.isDialogOpen = true;
  }

  closeDialog(event: boolean) {
    console.log('Dialog wird geschlossen', event);
    this.isDialogOpen = false;
  }

  updateContact(updatedContact: any) {
    this.contact = { ...updatedContact }; // Lokale Kopie aktualisieren
    this.isDialogOpen = false;
  }
}
