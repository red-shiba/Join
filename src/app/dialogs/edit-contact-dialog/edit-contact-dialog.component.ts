import { Component, Output, EventEmitter, Input } from '@angular/core';
import { Contact } from '../../interfaces/contact';
import { ContactListService } from '../../firebase-service/contact-list.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-contact-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-contact-dialog.component.html',
  styleUrl: './edit-contact-dialog.component.scss'
})
export class EditContactDialogComponent {
  @Input() contact: Contact | null = null;
  @Output() editDialogClosed: EventEmitter<boolean> = new EventEmitter();
  @Output() contactUpdated: EventEmitter<Contact> = new EventEmitter();

  name = '';
  email = '';
  phone = 0;

  constructor(public contactService: ContactListService) {}

  ngOnChanges() {
    if (this.contact) {
      this.name = this.contact.name;
      this.email = this.contact.email;
      this.phone = this.contact.phone;
    }
  }

  closeDialog() {
    this.editDialogClosed.emit(false);
  }

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
}
