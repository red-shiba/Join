import { Component, Input } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { EditContactDialogComponent } from '../../../dialogs/edit-contact-dialog/edit-contact-dialog.component';
import { ContactListService } from '../../../firebase-service/contact-list.service';
import { AvatarColorService } from '../../../services/avatar-color.service';

@Component({
  selector: 'app-single-contact',
  standalone: true,
  imports: [FormsModule, CommonModule, EditContactDialogComponent],
  templateUrl: './single-contact.component.html',
  styleUrl: './single-contact.component.scss',
})
export class SingleContactComponent {
  @Input() contact: any;
  isDialogOpen = false;
  selectedContact: any = null;

  constructor(
    private contactService: ContactListService,
    private avatarColorService: AvatarColorService
  ) {}

  get avatarColor(): string {
    return this.avatarColorService.getAvatarColor(this.contact);
  }

  getInitials(name: string): string {
    if (!name) return '';
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase();
  }

  openDialog() {
    this.selectedContact = { ...this.contact };
    this.isDialogOpen = true;
  }

  closeDialog() {
    this.isDialogOpen = false;
  }

  updateContact(updatedContact: any) {
    this.contactService.updateContact(updatedContact);
    this.isDialogOpen = false;
  }

  deleteContact() {
    if (this.contact.id) {
      this.contactService.deleteContact('contact', this.contact.id).then(() => {
        window.location.reload();
      });
    }
  }
}
