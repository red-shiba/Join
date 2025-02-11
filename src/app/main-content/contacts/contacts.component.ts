import { Component } from '@angular/core';
import { Contact } from '../../interfaces/contact';
import { ContactListService } from '../../firebase-service/contact-list.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss',
})
export class ContactsComponent {
  contactList: Contact[] = [];

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



  // selectedContact: Contact | null = null;
  // selectContact(contact: Contact) {
  //   this.selectedContact = contact;
  // }
  // // Alphabetische Sortierung der Gruppen
  // Object.keys(this.contacts).forEach(letter => {
  //   this.contacts[letter].sort((a, b) => a.name.localeCompare(b.name));
  // });
}
