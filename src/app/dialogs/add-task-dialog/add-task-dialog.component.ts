import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Todo } from '../../interfaces/todos';
import { TodoListService } from '../../firebase-service/todo-list.service';
import { Contact } from '../../interfaces/contact';
import { ContactListService } from '../../firebase-service/contact-list.service';
import { AvatarColorService } from '../../services/avatar-color.service';

@Component({
  selector: 'app-add-task-dialog',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-task-dialog.component.html',
  styleUrl: './add-task-dialog.component.scss'
})

export class AddTaskDialogComponent {
  @Input() defaultType: string | null = null;
  @Output() addDialogClosed = new EventEmitter<boolean>();

  title = '';
  description = '';
  assignedTo = '';
  dueDate = '';
  priority = '';
  activePriority = '';
  category = '';
  subtaskInput = '';
  subtasks: any[] = [];
  showControls = false;
  contactList: Contact[] = [];
  selectedContacts: Contact[] = [];
  dropdownOpen = false;
  isClosing = false;
  type: any = '';

  editedSubtaskIndex: number | null = null;
  editedSubtaskValue: string = '';

  constructor(
    private todoListService: TodoListService,
    private contactListService: ContactListService,
    private avatarColorService: AvatarColorService
  ) {}

  ngOnInit() {
    this.contactListService.getContacts().subscribe((contacts) => {
      this.contactList = contacts;
    });
    this.setPriority('medium');
    if (this.defaultType) {
      this.type = this.defaultType;
    }
  }

  closeDialog() {
    this.isClosing = true;
    setTimeout(() => {
      this.addDialogClosed.emit(false);
    }, 200);
  }

  getAvatarColor(contact: Contact): string {
    return this.avatarColorService.getAvatarColor(contact);
  }

  toggleContactSelection(contact: Contact, event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
      this.selectedContacts.push(contact);
    } else {
      this.selectedContacts = this.selectedContacts.filter(
        (c) => c !== contact
      );
    }
  }

  setPriority(priority: string) {
    this.priority = priority;
    this.activePriority = priority;
    this.updateButtonStyles();
  }

  private updateButtonStyles() {
    const buttons = document.querySelectorAll('.priority-btn');
    buttons.forEach((button) => {
      if (button instanceof HTMLElement) {
        if (button.getAttribute('data-priority') === this.activePriority) {
          button.classList.add('active');
        } else {
          button.classList.remove('active');
        }
      }
    });
  }

  activateInput() {
    this.showControls = true;
  }

  confirmSubtask() {
    if (this.subtaskInput.trim() !== '') {
      this.subtasks.push({ title: this.subtaskInput.trim(), done: false });
      this.subtaskInput = '';
      this.showControls = false;
    }
  }

  cancelSubtask() {
    this.subtaskInput = '';
    this.showControls = false;
    this.closeDialog();
  }

  hideControls() {
    if (this.subtaskInput.trim() === '') {
      setTimeout(() => {
        this.showControls = false;
      }, 200);
    }
  }

  deleteSubtask(index: number) {
    this.subtasks.splice(index, 1);
  }

  editSubtask(index: number) {
    this.editedSubtaskIndex = index;
    this.editedSubtaskValue = this.subtasks[index].title;
  }

  saveSubtask(index: number) {
    if (this.editedSubtaskValue.trim() !== '') {
      this.subtasks[index].title = this.editedSubtaskValue.trim();
      this.cancelEdit();
    }
  }

  cancelEdit() {
    this.editedSubtaskIndex = null;
    this.editedSubtaskValue = '';
  }

  addTodo() {
    if (!this.title || !this.dueDate || !this.category) {
      console.warn('Task-Erstellung fehlgeschlagen: Fehlende Pflichtfelder!');
      return;
    }

    const newTask: Todo = {
      id: '',
      type: this.type,
      title: this.title,
      description: this.description,
      assignedTo: this.selectedContacts.map((c) => c.name).join(', '),
      dueDate: this.dueDate,
      priority: this.priority,
      category: this.category,
      subtasks: this.subtasks,
    };

    this.todoListService
      .addTodo(newTask, this.type)
      .then(() => {
        console.log('Task erfolgreich hinzugefügt:', newTask);
        this.closeDialog();
      })
      .catch((error) => {
        console.error('Fehler beim Speichern des Tasks:', error);
      });

    this.title = '';
    this.description = '';
    this.dueDate = '';
    this.priority = '';
    this.category = '';
    this.selectedContacts = [];
    this.subtasks = [];
  }

  getInitials(name: string): string {
    if (!name) return '';
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase();
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  isSelected(contact: Contact): boolean {
    return this.selectedContacts.includes(contact);
  }
}
