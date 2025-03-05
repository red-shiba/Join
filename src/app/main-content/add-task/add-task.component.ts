import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Subtask, Todo } from '../../interfaces/todos';
import { TodoListService } from '../../firebase-service/todo-list.service';
import { ContactListService } from '../../firebase-service/contact-list.service';
import { Contact } from '../../interfaces/contact';
import { AvatarColorService } from '../../services/avatar-color.service';

@Component({
  selector: 'app-add-task',
  standalone: true,
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss'],
  imports: [CommonModule, FormsModule],
})
export class AddTaskComponent {
  title: string = '';
  description: string = '';
  assignedTo: string = '';
  dueDate: string = '';
  priority: string = '';
  activePriority: string = '';
  category: string = '';
  subtaskInput: string = '';
  subtasks: Subtask[] = [];
  showControls: boolean = false;
  contactList: Contact[] = [];
  selectedContacts: Contact[] = [];
  dropdownOpen = false;

  isSelected(contact: Contact): boolean {
    return this.selectedContacts.includes(contact);
  }

  editedSubtaskIndex: number | null = null; // Index des bearbeiteten Subtasks
  editedSubtaskValue: string = ''; // Temporärer Wert für Bearbeitung

  constructor(
    private todoListService: TodoListService,
    private contactListService: ContactListService,
    private avatarColorService: AvatarColorService
  ) {}

  ngOnInit() {
    this.contactListService.getContacts().subscribe((contacts) => {
      this.contactList = contacts;
    });

    this.setPriority('medium'); // setzt die priorität auf medium
  }

  getList(): Contact[] {
    return this.contactListService.contacts;
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
      type: 'todo',
      title: this.title,
      description: this.description,
      assignedTo: this.selectedContacts.map((c) => c.name).join(', '),
      dueDate: this.dueDate,
      priority: this.priority,
      category: this.category,
      subtasks: this.subtasks,
    };

    this.todoListService
      .addTodo(newTask, 'todo')
      .then(() => {
        console.log('Task erfolgreich hinzugefügt:', newTask);
      })
      .catch((error) => {
        console.error('Fehler beim Speichern des Tasks:', error);
      });

    // Felder zurücksetzen
    this.title = '';
    this.description = '';
    this.dueDate = '';
    this.priority = 'low ';
    this.category = '';
    this.selectedContacts = [];
    this.subtasks = [];
  }

  closeDialog() {
    console.log('Closing dialog');
  }

  getInitials(name: string): string {
    if (!name) return '';
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase();
  }

  getAlphabeticalLetters(): string[] {
    let letters: string[] = [];
    for (let contact of this.getList()) {
      if (!letters.includes(contact.name[0].toUpperCase())) {
        let firstLetter = contact.name[0].toUpperCase();
        letters.push(firstLetter);
      }
    }
    return letters.sort();
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  onFocus() {
    document.querySelector('.arrow-icon')?.classList.add('rotate');
  }

  onBlur() {
    document.querySelector('.arrow-icon')?.classList.remove('rotate');
  }
}
