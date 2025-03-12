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
  styleUrl: './add-contact-dialog.component.scss',
})
export class AddContactDialogComponent {
  @Output() addDialogCloseed: EventEmitter<boolean> = new EventEmitter();
  name = '';
  email = '';
  phone = '';
  isClosing = false;
  avatarColor: string = '#ccc';

  isNameFocused: boolean = false;
  isEmailFocused: boolean = false;
  isPhoneFocused: boolean = false;

  constructor(public contactService: ContactListService) {}

  closeDialog() {
    this.isClosing = true;
    setTimeout(() => {
      this.addDialogCloseed.emit(false);
    }, 180);
  }

  addContact() {
    if (!this.name || !this.email || !this.phone) return;

    let contact: Contact = {
      type: 'contact',
      name: this.name,
      email: this.email,
      phone: this.phone,
    };

    this.contactService.addContact(contact).then(() => {
      this.addDialogCloseed.emit(true);
    });
  }

  getInitials(name: string): string {
    if (!name) return '';
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase();
  }
}
