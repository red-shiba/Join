import { Component, Output, EventEmitter } from '@angular/core';
import { Contact } from '../../interfaces/contact';
import { ContactListService } from '../../firebase-service/contact-list.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-add-contact-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-contact-dialog.component.html',
  styleUrl: './add-contact-dialog.component.scss'
})
export class AddContactDialogComponent {
  @Output() addDialogCloseed: EventEmitter<boolean> = new EventEmitter();
  name = '';
  email = '';
  phone = 0;

  constructor(public contactService: ContactListService) {}

  closeDialog() {
    this.name = '';
    this.email = '';
    this.phone = 0;
    this.addDialogCloseed.emit(false);
  }

  addContact() {
    let contact: Contact = {
      type: "contact",
      name: this.name,
      email: this.email,
      phone: this.phone,
    }
    this.contactService.addContact(contact);
    // this.addDialogCloseed.emit(false);
    this.closeDialog();
  }
  
  getInitials(name: string): string {
    if (!name) return '';
    return name
      .split(' ') // Name in Wörter splitten
      .map((word) => word[0]) // Erstes Zeichen jedes Wortes nehmen
      .join('') // Buchstaben zusammenfügen
      .toUpperCase(); // Großbuchstaben
  }
} 
