import { Component } from '@angular/core';
import { Contact } from '../../interfaces/contact';
import { ContactListService } from '../../firebase-service/contact-list.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AddContactDialogComponent } from '../../dialogs/add-contact-dialog/add-contact-dialog.component';
import { SingleContactComponent } from './single-contact/single-contact.component';

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
  // Liste der Hintergrundfarben
  profileBgColors: string[] = [
    '#ff7a00', // $profile-bg-1
    '#ff5eb3', // $profile-bg-2
    '#6e52ff', // $profile-bg-3
    '#0038ff', // $profile-bg-4
    '#9327ff', // $profile-bg-5
    '#fc71ff', // $profile-bg-6
    '#00bee8', // $profile-bg-7
    '#1fd7c1', // $profile-bg-8
    '#ffa35e', // $profile-bg-9
    '#ffbb2b', // $profile-bg-10
    '#ffc701', // $profile-bg-11
    '#ffe62b', // $profile-bg-12
    '#c3ff2b', // $profile-bg-13
    '#ff745e', // $profile-bg-14
    '#ff4646', // $profile-bg-15
  ];

  constructor(private contactListService: ContactListService) {}

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
    let letters = new Set<string>();

    // Durchlaufe alle Kontakte und sammle die Anfangsbuchstaben
    for (let contact of this.getList()) {
      if (contact.name) {
        let firstLetter = contact.name[0].toUpperCase();
        letters.add(firstLetter);
      }
    }

    // Konvertiere das Set in ein Array und sortiere es
    return Array.from(letters).sort();
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
