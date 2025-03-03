import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Todo } from '../../interfaces/todos';
import { TodoListService } from '../../firebase-service/todo-list.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Contact } from '../../interfaces/contact';
import { ContactListService } from '../../firebase-service/contact-list.service';
import { AvatarColorService } from '../../services/avatar-color.service';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [TodoListService],
  templateUrl: './task-card.component.html',
  styleUrls: ['./task-card.component.scss'],
})
export class TaskCardComponent {
  @Input() todo: Todo | null = null;
  @Output() closeOverlay = new EventEmitter<boolean>();

  isClosing = false;
  isEditing = false;
  dropdownOpen = false;

  editedTodo: Todo = {
    id: '',
    title: '',
    description: '',
    dueDate: '',
    priority: '',
    assignedTo: '',
    subtasks: [],
    type: 'todo',
    category: '',
  };

  uncheckedImage = '/assets/icons/check_box.png';
  checkedImage = '/assets/icons/check_ed.png';
  isChecked = false;
  selectedContacts: Contact[] = [];
  contactList: Contact[] = [];

  constructor(private todoService: TodoListService) {}

  toggleCheckBox() {
    this.isChecked = !this.isChecked;
  }

  close() {
    this.closeOverlay.emit();
  }

  getPriorityIcon(priority: string | null | undefined): string {
    switch (priority) {
      case 'urgent':
        return '/assets/icons/prio_high.png';
      case 'medium':
        return '/assets/icons/prio_medium.png';
      case 'low':
        return '/assets/icons/prio_low.png';
      default:
        return '';
    }
  }

  editTodo() {
    if (this.todo) {
      this.isEditing = true;
      this.editedTodo = { ...this.todo };

      this.selectedContacts = this.todo.assignedTo
        ? this.todo.assignedTo
            .split(', ')
            .map((name) => this.contactList.find((contact) => contact.name === name)!)
            .filter((contact) => contact !== undefined) as Contact[]
        : [];
    }
  }

  async saveTodo() {
    if (this.editedTodo && this.editedTodo.id) {
      this.editedTodo.assignedTo = this.selectedContacts.map((contact) => contact.name).join(', ');
      await this.todoService.updateTodo(this.editedTodo);

      this.todo = { ...this.editedTodo };
      this.isEditing = false;
      this.dropdownOpen = false;
      this.closeOverlay.emit();
    }
  }

  cancelEdit() {
    this.isEditing = false;
    this.dropdownOpen = false;
  }

  deleteTodo() {
    if (this.todo && this.todo.id) {
      this.todoService.deleteTodo(this.todo.id).then(() => {
        this.closeOverlay.emit();
      });
    }
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  toggleContactSelection(contact: Contact, event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
      this.selectedContacts.push(contact);
    } else {
      this.selectedContacts = this.selectedContacts.filter((c) => c !== contact);
    }
  }

  deleteContact(contact: Contact) {
    this.selectedContacts = this.selectedContacts.filter((c) => c !== contact);
  }

  getPriorityIcon(priority: string | null | undefined): string {
    switch (priority) {
      case 'urgent':
        return '/assets/icons/prio_high.png';
      case 'medium':
        return '/assets/icons/prio_medium.png';
      case 'low':
        return '/assets/icons/prio_low.png';
      default:
        return '';
    }
  }

  getCategoryColor(category: string | null | undefined): string {
    let categoryColors: { [key: string]: string } = {
      'Technical Task': '#1FD7C1',
      'User Story': '#0038FF',
    };

    return category ? categoryColors[category] || '#CCCCCC' : '#CCCCCC';
  }

  getAvatarColor(contact: Contact): string {
    return this.avatarColorService.getAvatarColor(contact);
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase();
  }

  trackByContact(index: number, contact: Contact): string {
    return contact.id ?? '';
  }
}



