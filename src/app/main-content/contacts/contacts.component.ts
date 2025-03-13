/**
 * ContactsComponent - Manages and displays the list of contacts.
 * 
 * This component provides:
 * - A list of contacts categorized alphabetically.
 * - The ability to select, edit, and delete contacts.
 * - Dialogs for adding and editing contacts.
 * - Responsive behavior for mobile and desktop views.
 */

import { Component, HostListener } from '@angular/core';
import { Contact } from '../../interfaces/contact';
import { ContactListService } from '../../firebase-service/contact-list.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AddContactDialogComponent } from '../../dialogs/add-contact-dialog/add-contact-dialog.component';
import { EditContactDialogComponent } from '../../dialogs/edit-contact-dialog/edit-contact-dialog.component';
import { SingleContactComponent } from './single-contact/single-contact.component';
import { AvatarColorService } from '../../services/avatar-color.service';

/**
 * Contacts component.
 * 
 * - **Displays a list of contacts** sorted alphabetically.
 * - **Handles contact selection, editing, and deletion**.
 * - **Manages dialogs** for adding and updating contacts.
 * - **Adjusts UI behavior based on screen size**.
 */
@Component({
  selector: 'app-contacts',
  standalone: true,
  imports: [
    FormsModule,
    CommonModule,
    AddContactDialogComponent,
    SingleContactComponent,
    EditContactDialogComponent
  ],
  templateUrl: './contacts.component.html',
  styleUrl: './contacts.component.scss',
})
export class ContactsComponent {
  /**
   * List of contacts.
   */
  contactList: Contact[] = [];

  /**
   * Indicates if the add/edit contact dialog is open.
   */
  isDialogOpen = false;

  /**
   * The currently selected contact.
   */
  selectedContact: Contact | null = null;

  /**
   * Indicates if the view is in mobile mode.
   */
  isMobileView = false;

  /**
   * Controls whether the dropdown menu is open.
   */
  isDropdownOpen = false;

  /**
   * Controls whether the dropdown dialog is open.
   */
  DropdownDialogOpen = false;

  /**
   * Stores the media query object for detecting screen size changes.
   */
  private mobileQuery!: MediaQueryList;

  /**
   * Initializes the component with necessary services.
   * 
   * @param contactListService - Service to manage contacts.
   * @param avatarColorService - Service to generate avatar colors.
   */
  constructor(
    private contactListService: ContactListService,
    private avatarColorService: AvatarColorService,
  ) { }

  /**
   * Lifecycle hook that initializes the media query listener.
   */
  ngOnInit(): void {
    this.initMediaQueryListener();
  }

  /**
   * Lifecycle hook that removes the media query listener on component destruction.
   */
  ngOnDestroy(): void {
    this.mobileQuery.removeEventListener("change", this.handleMediaChange);
  }

  /**
   * Initializes the media query listener for detecting mobile view.
   */
  initMediaQueryListener() {
    this.mobileQuery = window.matchMedia("(max-width: 620px)");

    this.handleMediaChange(this.mobileQuery);
    this.mobileQuery.addEventListener("change", this.handleMediaChange);
  }

  /**
   * Handles changes in screen size.
   * 
   * @param event - The media query event.
   */
  handleMediaChange = (event: MediaQueryListEvent | MediaQueryList) => {
    this.isMobileView = event.matches;
    if (!this.isMobileView) {
      this.selectedContact = null;
    }
  };

  /**
   * Retrieves a unique avatar color for a given contact.
   * 
   * @param contact - The contact object.
   * @returns A hex color string.
   */
  getAvatarColor(contact: Contact): string {
    return this.avatarColorService.getAvatarColor(contact);
  }

  /**
   * Retrieves the list of contacts.
   * 
   * @returns An array of contacts.
   */
  getList(): Contact[] {
    return this.contactListService.contacts;
  }

  /**
   * Extracts initials from a given name.
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
   * Retrieves an array of unique alphabetical letters from contact names.
   * 
   * @returns A sorted array of unique first letters.
   */
  getAlphabeticalLetters(): string[] {
    let letters: string[] = [];
    for (let contact of this.getList()) {
      let firstLetter = contact.name[0].toUpperCase();
      if (!letters.includes(firstLetter)) {
        letters.push(firstLetter);
      }
    }
    return letters.sort();
  }

  /**
   * Retrieves contacts that belong to a specific alphabetical letter.
   * 
   * @param letter - The letter to filter contacts by.
   * @returns An array of contacts whose names start with the given letter.
   */
  getContactsByLetter(letter: string): Contact[] {
    return this.getList()
      .filter((contact) => contact.name && contact.name[0].toUpperCase() === letter)
      .sort((a, b) => a.name.localeCompare(b.name));
  }

  /**
   * Opens the add contact dialog.
   */
  openDialog() {
    console.log('Opening dialog');
    this.isDialogOpen = true;
  }

  /**
   * Opens the dropdown menu for contact actions.
   */
  isDropdownDialogOpen() {
    console.log('Dropdown dialog open');
    this.DropdownDialogOpen = true;
    this.isDropdownOpen = false;
  }

  /**
   * Closes the add/edit contact dialog.
   * 
   * @param event - Boolean indicating whether the dialog should close.
   */
  closeDialog(event: boolean) {
    console.log('Closing dialog', event);
    this.isDialogOpen = false;
  }

  /**
   * Closes the dropdown dialog.
   */
  isDropdowncloseDialog() {
    console.log('Closing dropdown dialog');
    this.DropdownDialogOpen = false;
  }

  /**
   * Selects a contact and updates the UI accordingly.
   * 
   * @param contact - The contact to be selected.
   */
  selectContact(contact: Contact) {
    this.selectedContact = this.selectedContact === contact ? null : contact;

    if (this.isMobileView) {
      document.querySelector('.contact-container')?.classList.add('hide-list');
      document.querySelector('.rightMainFrame')?.classList.add('show');
    }

    console.log('Selected contact:', this.selectedContact);
  }

  /**
   * Resets the selected contact and restores the contact list view.
   */
  showContactContainer() {
    this.selectedContact = null;
    document.querySelector('.rightMainFrame')?.classList.remove('show');
    document.querySelector('.contact-container')?.classList.remove('hide-list');
  }

  /**
   * Checks if a given contact is currently selected.
   * 
   * @param contact - The contact to check.
   * @returns `true` if the contact is selected, otherwise `false`.
   */
  isSelected(contact: Contact): boolean {
    return this.selectedContact === contact;
  }

  /**
   * Toggles the dropdown menu.
   */
  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  /**
   * Updates a contact's details.
   * 
   * @param updatedContact - The updated contact data.
   */
  updateContact(updatedContact: any) {
    this.contactListService.updateContact(updatedContact).then(() => {
      this.selectedContact = updatedContact;
    });
    this.isDialogOpen = false;
  }

  /**
   * Deletes the selected contact from the database.
   */
  deleteContact() {
    if (this.selectedContact && this.selectedContact.id) {
      this.contactListService.deleteContact('contact', this.selectedContact.id).then(() => {
        window.location.reload();
      });
    }
    this.isDropdownOpen = false;
  }

  /**
   * Closes the dropdown menu when clicking outside of it.
   * 
   * @param event - The click event.
   */
  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    const targetElement = event.target as HTMLElement;
    if (!targetElement.closest('.option-btn-mobile') && !targetElement.closest('.dropdown-menu-mobile')) {
      this.isDropdownOpen = false;
    }
  }
}
