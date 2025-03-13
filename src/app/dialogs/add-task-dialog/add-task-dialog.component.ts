/**
 * AddTaskDialogComponent - Enables users to add new tasks, configure priority, assign contacts, and manage subtasks.
 *
 * This component provides:
 * - A form for inputting basic task information (title, description, due date, category).
 * - Priority selection with visual style updates.
 * - A contact selection dropdown to assign tasks to multiple contacts.
 * - Subtask creation, editing, and deletion.
 * - Dialog-based user experience for confirming or canceling task creation.
 */
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
  /**
   * Preselected task type (e.g., "inprogress", "todo") received from the parent component.
   */
  @Input() defaultType: string | null = null;

  /**
   * Event emitted when the dialog is closed, indicating whether it should remain open (`true`) or closed (`false`).
   */
  @Output() addDialogClosed = new EventEmitter<boolean>();

  /**
   * Basic task information fields.
   */
  title = '';
  description = '';
  assignedTo = '';
  dueDate = '';
  priority = '';
  activePriority = '';
  category = '';

  /**
   * Subtask handling and state management.
   */
  subtaskInput = '';
  subtasks: any[] = [];
  showControls = false;

  /**
   * Array of available contacts from the ContactListService.
   */
  contactList: Contact[] = [];

  /**
   * Contacts assigned to the current task.
   */
  selectedContacts: Contact[] = [];

  /**
   * Controls the dropdown menu's open/close state.
   */
  dropdownOpen = false;

  /**
   * Determines if the dialog is in the process of closing.
   */
  isClosing = false;

  /**
   * The task type (e.g., "todo", "inprogress"). Defaults to 'todo' if not specified.
   */
  type: any = '';

  /**
   * Subtask editing state.
   */
  editedSubtaskIndex: number | null = null;
  editedSubtaskValue: string = '';

  /**
   * Initializes required services: task handling, contact retrieval, and avatar colors.
   *
   * @param todoListService - Handles CRUD operations for task items.
   * @param contactListService - Provides the list of contacts from Firestore.
   * @param avatarColorService - Generates avatar colors for assigned contacts.
   */
  constructor(
    private todoListService: TodoListService,
    private contactListService: ContactListService,
    private avatarColorService: AvatarColorService
  ) {}

  /**
   * Lifecycle hook that subscribes to the contact list, sets a default priority, 
   * and if specified, assigns a default task type.
   */
  ngOnInit() {
    this.contactListService.getContacts().subscribe((contacts) => {
      this.contactList = contacts;
    });
    this.setPriority('medium');
    if (this.defaultType) {
      this.type = this.defaultType;
    }
  }

  /**
   * Initiates the dialog's closing animation, then emits an event to close the dialog after a delay.
   */
  closeDialog() {
    this.isClosing = true;
    setTimeout(() => {
      this.addDialogClosed.emit(false);
    }, 200);
  }

  /**
   * Retrieves a dynamic avatar color for a given contact.
   *
   * @param contact - The contact for which to retrieve the avatar color.
   * @returns A string representing the avatar color.
   */
  getAvatarColor(contact: Contact): string {
    return this.avatarColorService.getAvatarColor(contact);
  }

  /**
   * Toggles whether a contact is selected for assignment to the task.
   *
   * @param contact - Contact to select or deselect.
   * @param event - The change event from the checkbox input.
   */
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

  /**
   * Sets the priority of the task and updates the corresponding button styles.
   *
   * @param priority - A string representing the new priority (e.g. "urgent", "medium", "low").
   */
  setPriority(priority: string) {
    this.priority = priority;
    this.activePriority = priority;
    this.updateButtonStyles();
  }

  /**
   * Updates CSS classes of the priority buttons to reflect the active priority.
   * Called internally whenever `setPriority()` is invoked.
   */
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

  /**
   * Shows the input controls for creating a new subtask.
   */
  activateInput() {
    this.showControls = true;
  }

  /**
   * Adds the user's input as a new subtask to the subtasks array and hides the controls.
   */
  confirmSubtask() {
    if (this.subtaskInput.trim() !== '') {
      this.subtasks.push({ title: this.subtaskInput.trim(), done: false });
      this.subtaskInput = '';
      this.showControls = false;
    }
  }

  /**
   * Cancels new subtask creation, hides controls, and closes the dialog.
   */
  cancelSubtask() {
    this.subtaskInput = '';
    this.showControls = false;
    this.closeDialog();
  }

  /**
   * Delays hiding the subtask input controls to accommodate UI interactions.
   */
  hideControls() {
    if (this.subtaskInput.trim() === '') {
      setTimeout(() => {
        this.showControls = false;
      }, 200);
    }
  }

  /**
   * Removes a subtask from the subtasks array at the specified index.
   *
   * @param index - The index of the subtask to delete.
   */
  deleteSubtask(index: number) {
    this.subtasks.splice(index, 1);
  }

  /**
   * Switches a specified subtask into edit mode.
   *
   * @param index - The index of the subtask to edit.
   */
  editSubtask(index: number) {
    this.editedSubtaskIndex = index;
    this.editedSubtaskValue = this.subtasks[index].title;
  }

  /**
   * Saves changes to the subtask currently in edit mode.
   *
   * @param index - The index of the subtask being edited.
   */
  saveSubtask(index: number) {
    if (this.editedSubtaskValue.trim() !== '') {
      this.subtasks[index].title = this.editedSubtaskValue.trim();
      this.cancelEdit();
    }
  }

  /**
   * Cancels the current subtask edit mode and clears temporary values.
   */
  cancelEdit() {
    this.editedSubtaskIndex = null;
    this.editedSubtaskValue = '';
  }

  /**
   * Adds a new task based on the user's input fields. 
   * Checks for required fields (title, dueDate, category) before creation.
   * On success, logs a confirmation and closes the dialog.
   */
  addTodo() {
    if (!this.title || !this.dueDate || !this.category) {
      console.warn('Task creation failed: Missing required fields!');
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
        console.log('Task successfully added:', newTask);
        this.closeDialog();
      })
      .catch((error) => {
        console.error('Error saving the task:', error);
      });

    // Reset form fields after submission
    this.title = '';
    this.description = '';
    this.dueDate = '';
    this.priority = '';
    this.category = '';
    this.selectedContacts = [];
    this.subtasks = [];
  }

  /**
   * Extracts uppercase initials (e.g., "John Doe" -> "JD") from the provided name string.
   *
   * @param name - The name from which to derive initials.
   * @returns A string of uppercase initials.
   */
  getInitials(name: string): string {
    if (!name) return '';
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase();
  }

  /**
   * Toggles the dropdown menu for assigning contacts.
   */
  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  /**
   * Determines whether the provided contact has already been selected.
   *
   * @param contact - The contact to check.
   * @returns `true` if the contact is selected, otherwise `false`.
   */
  isSelected(contact: Contact): boolean {
    return this.selectedContacts.includes(contact);
  }

  /**
   * Rotates the dropdown arrow icon upon focus.
   */
  onFocus() {
    document.querySelector('.arrow-icon')?.classList.add('rotate');
  }

  /**
   * Removes the rotation from the dropdown arrow icon upon losing focus.
   */
  onBlur() {
    document.querySelector('.arrow-icon')?.classList.remove('rotate');
  }
}
