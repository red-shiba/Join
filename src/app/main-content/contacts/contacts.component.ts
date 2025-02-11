import { Component } from '@angular/core';
import { Contact } from '../../interfaces/contact';
import { ContactListService } from '../../firebase-service/contact-list.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AddContactDialogComponent } from '../../dialogs/add-contact-dialog/add-contact-dialog.component';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [FormsModule, CommonModule, AddContactDialogComponent],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss',
})
export class ContactsComponent {

  contactList: Contact[] = [];
  isDialogOpen = false;

  constructor(private contactListService: ContactListService) {
  }

  getList(): Contact[] {
    return this.contactListService.contacts;
  }

  getInitials(name: string): string {
    if (!name) return '';
    return name
      .split(' ') // Name in Wörter splitten
      .map(word => word[0]) // Erstes Zeichen jedes Wortes nehmen
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




  // selectedContact: Contact | null = null;
  // selectContact(contact: Contact) {
  //   this.selectedContact = contact;
  // }
  // // Alphabetische Sortierung der Gruppen
  // Object.keys(this.contacts).forEach(letter => {
  //   this.contacts[letter].sort((a, b) => a.name.localeCompare(b.name));
  // });
}
