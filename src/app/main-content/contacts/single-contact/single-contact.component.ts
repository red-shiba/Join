/**
 * SingleContactComponent - Represents an individual contact in the contact list.
 * 
 * This component:
 * - Displays a single contact's details.
 * - Provides options to edit or delete the contact.
 * - Uses dialogs for editing contacts.
 * - Generates an avatar color and initials for the contact.
 */

import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EditContactDialogComponent } from '../../../dialogs/edit-contact-dialog/edit-contact-dialog.component';
import { ContactListService } from '../../../firebase-service/contact-list.service';
import { AvatarColorService } from '../../../services/avatar-color.service';

/**
 * Single contact component.
 * 
 * - **Displays a contact's information** including name and avatar.
 * - **Allows editing or deleting a contact** using dialogs.
 * - **Generates avatar initials and colors** dynamically.
 */
@Component({
  selector: 'app-single-contact',
  standalone: true,
  imports: [FormsModule, CommonModule, EditContactDialogComponent],
  templateUrl: './single-contact.component.html',
  styleUrl: './single-contact.component.scss',
})
export class SingleContactComponent {
  @Input() contact: any; // The contact object passed as an input from the parent component.
  isDialogOpen = false; // Indicates if the edit contact dialog is open.
  selectedContact: any = null; // Stores the currently selected contact for editing.

  /**
   * Initializes the component with required services.
   * 
   * @param contactService - Service for managing contacts.
   * @param avatarColorService - Service for generating avatar colors.
   */
  constructor(
    private contactService: ContactListService,
    private avatarColorService: AvatarColorService
  ) {}

  /**
   * Computes the avatar color for the contact.
   * 
   * @returns A hex color string for the contact's avatar.
   */
  get avatarColor(): string {
    return this.avatarColorService.getAvatarColor(this.contact);
  }

  /**
   * Extracts initials from the contact's name.
   * 
   * @param name - The full name of the contact.
   * @returns Initials in uppercase.
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
   * Opens the edit contact dialog.
   */
  openDialog() {
    this.selectedContact = { ...this.contact };
    this.isDialogOpen = true;
  }

  /**
   * Closes the edit contact dialog.
   */
  closeDialog() {
    this.isDialogOpen = false;
  }

  /**
   * Updates the contact information.
   * 
   * @param updatedContact - The updated contact data.
   */
  updateContact(updatedContact: any) {
    this.contactService.updateContact(updatedContact).then(() => {
      this.contact = updatedContact;
    });
    this.isDialogOpen = false;
  }

  /**
   * Deletes the contact from the database.
   */
  deleteContact() {
    if (this.contact.id) {
      this.contactService.deleteContact('contact', this.contact.id).then(() => {
        window.location.reload();
      });
    }
  }
}
