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
  showControls = false;
  editedSubtaskIndex: number | null = null;
  editedSubtaskValue: string = '';
  subtasks: { title: string; done: boolean }[] = [];
  editableSubtasks: { title: string; done: boolean }[] = [];
  subtaskInput = '';
  contactList: Contact[] = [];
  selectedContacts: Contact[] = [];
  type: any = '';
  uncheckedImage = '/assets/icons/check_box.png';
  checkedImage = '/assets/icons/check_ed.png';
  isChecked = false;
  priority: string | undefined;
  activePriority: string | undefined;

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
  constructor(
    private todoService: TodoListService,
    private contactListService: ContactListService,
    private avatarColorService: AvatarColorService
  ) {}

  ngOnInit() {
    this.contactListService.getContacts().subscribe((contacts) => {
      this.contactList = contacts;
      if (this.todo && this.todo.assignedTo) {
        this.selectedContacts = this.todo.assignedTo
          .split(', ')
          .map(
            (name) => this.contactList.find((contact) => contact.name === name)!
          )
          .filter((contact) => contact !== undefined) as Contact[];
      }
    });
  }

  toggleCheckBox(subtask: any) {
    subtask.done = !subtask.done;
  }

  editTodo() {
    if (this.todo) {
      this.isEditing = true;
      this.editedTodo = { ...this.todo };
      this.activePriority = this.todo.priority;
      this.editableSubtasks = this.todo.subtasks
        ? this.todo.subtasks.map((subtask) => ({ ...subtask }))
        : [];

      this.selectedContacts = this.todo.assignedTo
        ? (this.todo.assignedTo
            .split(', ')
            .map(
              (name) =>
                this.contactList.find((contact) => contact.name === name)!
            )
            .filter((contact) => contact !== undefined) as Contact[])
        : [];

      setTimeout(() => this.updateButtonStyles(), 0);
    }
  }

  async saveTodo() {
    if (this.editedTodo && this.editedTodo.id) {
      this.editedTodo.subtasks = this.editableSubtasks;
      this.editedTodo.assignedTo = this.selectedContacts
        .map((contact) => contact.name)
        .join(', ');
      await this.todoService.updateTodo(this.editedTodo);
      this.todo = { ...this.editedTodo };
      this.isEditing = false;
      this.dropdownOpen = false;
      this.closeOverlay.emit();
      window.location.reload();
    }
  }

  deleteTodo() {
    if (this.todo && this.todo.id) {
      this.todoService.deleteTodo(this.todo.id).then(() => {
        this.closeOverlay.emit();
      });
    }
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

  setPriority(priority: string) {
    this.priority = priority;
    this.activePriority = priority;
    this.editedTodo.priority = priority;
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

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  isSelected(contact: Contact): boolean {
    return this.selectedContacts.includes(contact);
  }

  onFocus() {
    document.querySelector('.arrow-icon')?.classList.add('rotate');
  }

  onBlur() {
    document.querySelector('.arrow-icon')?.classList.remove('rotate');
  }

  activateInput() {
    this.showControls = true;
  }

  confirmSubtask() {
    if (this.subtaskInput.trim() !== '') {
      this.editableSubtasks.push({
        title: this.subtaskInput.trim(),
        done: false,
      });
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
    this.editableSubtasks.splice(index, 1);
  }

  editSubtask(index: number) {
    this.editedSubtaskIndex = index;
    this.editedSubtaskValue = this.editableSubtasks[index].title;
  }

  saveSubtask(index: number) {
    if (this.editedSubtaskValue.trim() !== '') {
      this.editableSubtasks[index].title = this.editedSubtaskValue.trim();
      this.cancelEdit();
    }
  }

  cancelEdit() {
    this.editedSubtaskIndex = null;
    this.editedSubtaskValue = '';
  }
}
