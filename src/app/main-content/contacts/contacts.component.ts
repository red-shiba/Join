import { Component, HostListener } from '@angular/core';
import { Contact } from '../../interfaces/contact';
import { ContactListService } from '../../firebase-service/contact-list.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AddContactDialogComponent } from '../../dialogs/add-contact-dialog/add-contact-dialog.component';
import { EditContactDialogComponent } from '../../dialogs/edit-contact-dialog/edit-contact-dialog.component';
import { SingleContactComponent } from './single-contact/single-contact.component';
import { AvatarColorService } from '../../services/avatar-color.service';

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
  contactList: Contact[] = [];
  isDialogOpen = false;
  selectedContact: Contact | null = null;
  isMobileView = false;
  isDropdownOpen = false;
  DropdownDialogOpen = false;
  private mobileQuery!: MediaQueryList;

  constructor(
    private contactListService: ContactListService,
    private avatarColorService: AvatarColorService,
  ) { }

  ngOnInit(): void {
    this.initMediaQueryListener();
  }

  ngOnDestroy(): void {
    // Listener sauber entfernen
    this.mobileQuery.removeEventListener("change", this.handleMediaChange);
  }

  initMediaQueryListener() {
    this.mobileQuery = window.matchMedia("(max-width: 620px)");

    // Initialer Check
    this.handleMediaChange(this.mobileQuery);

    // Event Listener für dynamische Änderungen
    this.mobileQuery.addEventListener("change", this.handleMediaChange);
  }

  handleMediaChange = (event: MediaQueryListEvent | MediaQueryList) => {
    this.isMobileView = event.matches;
    if (!this.isMobileView) {
      this.selectedContact = null; // Kontakt zurücksetzen, wenn zu Desktop gewechselt wird
    }
  };

  getAvatarColor(contact: Contact): string {
    return this.avatarColorService.getAvatarColor(contact);
  }

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
  // Gibt eine Liste der alphabetischen Buchstaben zurück, für die Kontakte vorhanden sind
  getAlphabeticalLetters(): string[] {
    let letters: string[] = [];

    // Durchlaufe alle Kontakte und sammle die Anfangsbuchstaben
    for (let contact of this.getList()) {
      if (!letters.includes(contact.name[0].toUpperCase())) {
        let firstLetter = contact.name[0].toUpperCase();
        letters.push(firstLetter);
      }
    }

    // Konvertiere das Set in ein Array und sortiere es
    return letters.sort();
  }

  // Gibt die Kontakte für einen bestimmten Buchstaben zurück
  getContactsByLetter(letter: string): Contact[] {
    return this.getList()
      .filter(
        (contact) => contact.name && contact.name[0].toUpperCase() === letter
      ) // Filtere nach Buchstabe
      .sort((a, b) => a.name.localeCompare(b.name)); // Sortiere alphabetisch
  }

  openDialog() {
    console.log('Dialog wird geöffnet');
    this.isDialogOpen = true; // Öffnet das Dialogfenster
  }

  isDropdownDialogOpen() {
    console.log('Dropdown Dialog offen');
    this.DropdownDialogOpen = true;
    this.isDropdownOpen = false;
  }

  closeDialog(event: boolean) {
    console.log('Dialog wird geschlossen', event);
    this.isDialogOpen = false; // Schließt das Fenster, wenn das Event ausgelöst wird
  }

  isDropdowncloseDialog() {
    console.log('Dropdown Dialog geschlossen');
    this.DropdownDialogOpen = false;
  }

  selectContact(contact: Contact) {
    if (this.selectedContact === contact) {
      // Wenn der gleiche Kontakt erneut angeklickt wird, setze die Auswahl zurück
      this.selectedContact = null;
    } else {
      // Andernfalls setze den neuen Kontakt als ausgewählt
      this.selectedContact = contact;
    }

    if (this.isMobileView) {
      document.querySelector('.contact-container')?.classList.add('hide-list');
      document.querySelector('.rightMainFrame')?.classList.add('show');
    }

    console.log('Ausgewählter Kontakt:', this.selectedContact);
  }

  showContactContainer() {
    this.selectedContact = null;
    document.querySelector('.rightMainFrame')?.classList.remove('show');
    document.querySelector('.contact-container')?.classList.remove('hide-list');
  }

  isSelected(contact: Contact): boolean {
    return this.selectedContact === contact;
  }

  toggleDropdown() {
    this.isDropdownOpen = !this.isDropdownOpen;
  }

  updateContact(updatedContact: any) {
    this.contactListService.updateContact(updatedContact).then(() => {
      this.selectedContact = updatedContact;
    });
    this.isDialogOpen = false;
  }

  deleteContact() {
    if (this.selectedContact && this.selectedContact.id) {
      this.contactListService.deleteContact('contact', this.selectedContact.id).then(() => {
        window.location.reload();
      });
    }
    this.isDropdownOpen = false;
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: Event) {
    const targetElement = event.target as HTMLElement;
    if (!targetElement.closest('.option-btn-mobile') && !targetElement.closest('.dropdown-menu-mobile')) {
      this.isDropdownOpen = false;
    }
  }
}