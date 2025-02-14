import { Component } from '@angular/core';
import { Contact } from '../../interfaces/contact';
import { ContactListService } from '../../firebase-service/contact-list.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AddContactDialogComponent } from '../../dialogs/add-contact-dialog/add-contact-dialog.component';
import { SingleContactComponent } from './single-contact/single-contact.component';
import { AvatarColorService } from '../../services/avatar-color.service';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    AddContactDialogComponent,
    SingleContactComponent,
  ],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss',
})
export class ContactsComponent {
  contactList: Contact[] = [];
  isDialogOpen = false;
  selectedContact: Contact | null = null;

  constructor(
    private contactListService: ContactListService,
    private avatarColorService: AvatarColorService
  ) {}

  getAvatarColor(contact: Contact): string {
    return this.avatarColorService.getAvatarColor(contact);
  }

  getList(): Contact[] {
    return this.contactListService.contacts;
  }

  getInitials(name: string): string {
    if (!name) return '';
    return name
      .split(' ') // Name in Wörter splitten
      .map((word) => word[0]) // Erstes Zeichen jedes Wortes nehmen
      .join('') // Buchstaben zusammenfügen
      .toUpperCase(); // Großbuchstaben
  }
  // Gibt eine Liste der alphabetischen Buchstaben zurück, für die Kontakte vorhanden sind
  getAlphabeticalLetters(): string[] {
    let letters: string[] = [];

    // Durchlaufe alle Kontakte und sammle die Anfangsbuchstaben
    for (let contact of this.getList()) {
      if (!letters.includes(contact.name[0].toUpperCase())) {
        let firstLetter = contact.name[0].toUpperCase();
        letters.push(firstLetter);
      }
    }

    // Konvertiere das Set in ein Array und sortiere es
    return letters.sort();
  }

  // Gibt die Kontakte für einen bestimmten Buchstaben zurück
  getContactsByLetter(letter: string): Contact[] {
    return this.getList()
      .filter(
        (contact) => contact.name && contact.name[0].toUpperCase() === letter
      ) // Filtere nach Buchstabe
      .sort((a, b) => a.name.localeCompare(b.name)); // Sortiere alphabetisch
  }

  openDialog() {
    console.log('Dialog wird geöffnet');
    this.isDialogOpen = true; // Öffnet das Dialogfenster
  }

  closeDialog(event: boolean) {
    console.log('Dialog wird geschlossen', event);
    this.isDialogOpen = false; // Schließt das Fenster, wenn das Event ausgelöst wird
  }

  selectContact(contact: Contact) {
    if (this.selectedContact === contact) {
      // Wenn der gleiche Kontakt erneut angeklickt wird, setze die Auswahl zurück
      this.selectedContact = null;
    } else {
      // Andernfalls setze den neuen Kontakt als ausgewählt
      this.selectedContact = contact;
    }
    console.log('Ausgewählter Kontakt:', this.selectedContact);
  }
  isSelected(contact: Contact): boolean {
    return this.selectedContact === contact;
  }
}
