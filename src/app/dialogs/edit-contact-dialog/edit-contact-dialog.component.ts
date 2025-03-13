/**
 * EditContactDialogComponent - Displays a dialog allowing users to edit or delete an existing contact.
 *
 * This component provides:
 * - An edit form for updating contact fields (name, email, phone).
 * - A live preview of the contact's avatar color, driven by the email address.
 * - Controls to save changes or delete the contact from Firestore.
 * - Animations and event emitters for opening and closing the dialog.
 */
import { Component, Output, EventEmitter, Input } from '@angular/core';
import { Contact } from '../../interfaces/contact';
import { ContactListService } from '../../firebase-service/contact-list.service';
import { AvatarColorService } from '../../services/avatar-color.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-contact-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-contact-dialog.component.html',
  styleUrl: './edit-contact-dialog.component.scss',
})
export class EditContactDialogComponent {
  /**
   * The contact object being edited. When changed, local fields are updated via ngOnChanges().
   */
  @Input() contact: Contact | null = null;

  /**
   * Emits an event to signal the parent component that the dialog has closed.
   * Sends a boolean (currently always `false`) to indicate closure.
   */
  @Output() editDialogClosed: EventEmitter<boolean> = new EventEmitter();

  /**
   * Emits an event with the updated contact once changes are saved.
   */
  @Output() contactUpdated: EventEmitter<Contact> = new EventEmitter();

  /**
   * The full name to be edited.
   */
  name: string = '';

  /**
   * The email address to be edited.
   */
  email: string = '';

  /**
   * The phone number to be edited.
   */
  phone: string = '';

  /**
   * Determines whether the email input has focus (for styling or other UI logic).
   */
  isFocused: boolean = false;

  /**
   * Determines whether the name input has focus.
   */
  isNameFocused: boolean = false;

  /**
   * Determines whether the phone input has focus.
   */
  isPhoneFocused: boolean = false;

  /**
   * Controls a closing animation state. When `true`, initiates the close dialog animation.
   */
  isClosing = false;

  /**
   * Initializes the contact list and avatar color services.
   *
   * @param contactService - Service for managing contacts in Firestore.
   * @param avatarColorService - Service that computes color values for avatars based on contact data.
   */
  constructor(
    public contactService: ContactListService,
    private avatarColorService: AvatarColorService
  ) {}

  /**
   * Dynamically retrieves the avatar color based on the current email address.
   * Falls back to a neutral color if no email is provided.
   */
  get avatarColor(): string {
    return this.email ? this.avatarColorService.getAvatarColor({ email: this.email } as Contact) : '#ccc';
  }

  /**
   * Lifecycle hook triggered when input properties change.
   * Synchronizes local fields with the incoming contact data.
   */
  ngOnChanges() {
    if (this.contact) {
      this.name = this.contact.name;
      this.email = this.contact.email;
      this.phone = this.contact.phone;
    }
  }

  /**
   * Triggers the closing animation and emits an event to notify the parent to close the dialog.
   */
  closeDialog() {
    this.isClosing = true;
    setTimeout(() => {
      this.editDialogClosed.emit(false);
    }, 180);
  }

  /**
   * Updates the contact record with new data and notifies the parent via `contactUpdated`.
   */
  updateContact() {
    if (!this.contact) return;

    let updatedContact: Contact = {
      ...this.contact,
      name: this.name,
      email: this.email,
      phone: this.phone,
    };

    this.contactService.updateContact(updatedContact);
    this.contactUpdated.emit(updatedContact);
    this.closeDialog();
  }

  /**
   * Generates uppercase initials from a contact name (e.g., "John Doe" -> "JD").
   *
   * @param name - The contact's full name.
   * @returns The uppercase initials derived from the name.
   */
  getInitials(name: string): string {
    if (!name) return '';
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase();
  }

  /**
   * Deletes the current contact record from Firestore and refreshes the page.
   */
  deleteContact() {
    if (this.contact && this.contact.id) {
      this.contactService.deleteContact('contact', this.contact.id).then(() => {
        window.location.reload();
      });
    }
  }
}
