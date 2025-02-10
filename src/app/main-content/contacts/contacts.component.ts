import { Component } from '@angular/core';

@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss',
})
export class ContactsComponent {
  // selectedContact: Contact | null = null;
  // selectContact(contact: Contact) {
  //   this.selectedContact = contact;
  // }
  // // Alphabetische Sortierung der Gruppen
  // Object.keys(this.contacts).forEach(letter => {
  //   this.contacts[letter].sort((a, b) => a.name.localeCompare(b.name));
  // });
}
