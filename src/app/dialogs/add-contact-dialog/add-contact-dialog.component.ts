/**
 * AddContactDialogComponent - Displays a dialog for creating a new contact.
 *
 * This component provides:
 * - A form for inputting required contact fields (name, email, phone).
 * - Basic validation to ensure all fields are filled before submission.
 * - An animated close mechanism and event emitter to notify the parent when the dialog is closed.
 */
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
  /**
   * Emits an event when the dialog is closed. 
   * The boolean indicates whether a new contact was successfully added (`true`) or simply closed (`false`).
   */
  @Output() addDialogCloseed: EventEmitter<boolean> = new EventEmitter();

  /**
   * Contact input fields.
   */
  name = '';
  email = '';
  phone = '';

  /**
   * Tracks whether the dialog is in the process of closing (for animations).
   */
  isClosing = false;

  /**
   * Default avatar color for the contact.
   */
  avatarColor: string = '#ccc';

  /**
   * Flags indicating focus states for name, email, and phone inputs.
   */
  isNameFocused: boolean = false;
  isEmailFocused: boolean = false;
  isPhoneFocused: boolean = false;

  /**
   * Injects the contact service to handle saving new contacts.
   *
   * @param contactService - The service responsible for Firestore operations on contacts.
   */
  constructor(public contactService: ContactListService) {}

  /**
   * Closes the dialog by initiating a closing animation, then emits an event to notify the parent.
   */
  closeDialog() {
    this.isClosing = true;
    setTimeout(() => {
      this.addDialogCloseed.emit(false);
    }, 180);
  }

  /**
   * Creates a new contact if all required fields are provided.
   * On success, emits an event indicating the dialog closed with a newly created contact.
   */
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

  /**
   * Generates uppercase initials from the provided name.
   * (e.g., "John Doe" -> "JD").
   *
   * @param name - The full name from which to generate initials.
   * @returns A string of uppercase initials.
   */
  getInitials(name: string): string {
    if (!name) return '';
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase();
  }
}
