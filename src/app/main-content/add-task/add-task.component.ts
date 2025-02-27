import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Todo } from '../../interfaces/todos';
import { TodoListService } from '../../firebase-service/todo-list.service';
import { ContactListService } from '../../firebase-service/contact-list.service';
import { Contact } from '../../interfaces/contact';
import { AvatarColorService } from '../../services/avatar-color.service';

@Component({
  selector: 'app-add-task',
  standalone: true,
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss'],
  imports: [CommonModule, FormsModule], // FormsModule hinzufügen!
})
export class AddTaskComponent {
  title: string = '';
  description: string = '';
  assignedTo: string = '';
  dueDate: string = '';
  priority: string = '';
  category: string = '';
  subtaskInput: string = '';
  subtasks: string[] = [];
  contactList: Contact[] = [];
  selectedContacts: Contact[] = [];
  dropdownOpen = false;

  constructor(
    private todoListService: TodoListService,
    private contactListService: ContactListService,
    private avatarColorService: AvatarColorService,
  ) {}

  ngOnInit() {
  this.contactListService.getContacts().subscribe(contacts => {
    this.contactList = contacts;
  });
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
      this.selectedContacts = this.selectedContacts.filter(c => c !== contact);
    }
  }

  setPriority(priority: string) {
    this.priority = priority;
  }

  addSubtask() {
    if (this.subtaskInput.trim()) {
      this.subtasks.push(this.subtaskInput.trim());
      this.subtaskInput = '';
    }
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
      assignedTo: this.selectedContacts.map(c => c.name).join(', '), // Kontakte als String speichern
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
    this.priority = 'low';
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

toggleDropdown() {
  this.dropdownOpen = !this.dropdownOpen;
}
}
