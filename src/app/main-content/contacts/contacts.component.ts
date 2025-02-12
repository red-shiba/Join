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

  openDialog() {
    console.log('Dialog wird geöffnet');
    this.isDialogOpen = true; // Öffnet das Dialogfenster
  }

  closeDialog(event: boolean) {
    console.log('Dialog wird geschlossen', event);
    this.isDialogOpen = false; // Schließt das Fenster, wenn das Event ausgelöst wird
  }

  selectContact(contact: Contact) {
    this.selectedContact = contact; // Setzt den ausgewählten Kontakt
    console.log('Ausgewählter Kontakt:', contact);
  }
}
