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
  @Output() editDialogClosed: EventEmitter<boolean> = new EventEmitter();
  @Input() contact! : Contact;
  edit = false;
  name = '';
  email = '';
  phone = 0;

  constructor(public contactService: ContactListService) {}

  openEdit(){
    this.edit = true;
  }

  closeEdit(){
    this.edit = false;
    this.saveContact();
  }

  deleteContact(){
    if (this.contact.id) {
      this.contactService.deleteContact( "contact", this.contact.id);
    }
  }

  saveContact(){
    this.contactService.updateContact(this.contact)
  }
} 
