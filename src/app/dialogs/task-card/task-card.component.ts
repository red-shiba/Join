import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Todo } from '../../interfaces/todos';
import { TodoListService } from '../../firebase-service/todo-list.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Contact } from '../../interfaces/contact';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [CommonModule, FormsModule],
  providers: [TodoListService],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.scss',
})
export class TaskCardComponent {
  @Input() todo: Todo | null = null;
  @Output() closeOverlay = new EventEmitter<boolean>();

  isClosing = false;
  isEditing = false;
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
  avatarColorService: any;
  selectedContacts: Contact[] = [];
  contactList: Contact[] = [];
  contactService: any;

  constructor(private todoService: TodoListService) {}

  toggleCheckBox(subtask: any) {
    subtask.done = !subtask.done;
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
    }
  }

  async saveTodo() {
    if (this.editedTodo && this.editedTodo.id) {
      console.log('Speichern von:', this.editedTodo);

      await this.todoService.updateTodo(this.editedTodo);

      this.todo = { ...this.editedTodo };
      this.isEditing = false;

      this.closeOverlay.emit();
    } else {
      console.warn('Kein gültiges Todo zum Speichern gefunden');
    }
  }

  cancelEdit() {
    this.isEditing = false;
  }

  deleteTodo() {
    if (this.todo && this.todo.id) {
      this.todoService.deleteTodo(this.todo.id).then(() => {
        this.closeOverlay.emit();
      });
    }
  }
  getCategoryColor(category: string | null | undefined): string {
    let categoryColors: { [key: string]: string } = {
      'Technical Task': '#1FD7C1',
      'User Story': '#0038FF',
    };

    return category ? categoryColors[category] || '#CCCCCC' : '#CCCCCC'; // falls die Kategorie nicht in der Liste ist, wird ein Grauton zurückgegeben
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
}
