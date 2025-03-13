/**
 * TaskCardComponent - Displays and manages the details of a single task (Todo item).
 *
 * This component provides:
 * - A detailed view of a task with title, description, assigned contacts, subtasks, and priority.
 * - Edit functionality to update an existing task’s fields (title, description, due date, etc.).
 * - Live subtask creation, editing, and deletion within the task card.
 * - Contact selection via a dropdown list, with dynamic toggling of the dropdown.
 * - Tools for visualizing priority, category, and other task properties (e.g., icons, colors).
 */
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
  @Input() todo: Todo | null = null; // The task (Todo) to display in this card.
  @Output() closeOverlay = new EventEmitter<boolean>(); // Emits an event when the overlay displaying this task card should close.
  isClosing = false; // Determines whether the overlay is in the process of closing.
  isEditing = false; // Controls whether the task is being edited.
  dropdownOpen = false; // Toggles the dropdown for contact selection.
  showControls = false; // Indicates if subtask input controls (input field + buttons) are visible.
  editedSubtaskIndex: number | null = null; // The index of a subtask currently in edit mode.
  editedSubtaskValue: string = ''; // Temporary storage for the edited subtask’s title value.
  subtasks: { title: string; done: boolean }[] = []; // Array of subtasks displayed in the template (initially copies from the Todo).
  editableSubtasks: { title: string; done: boolean }[] = []; // Editable subtasks array for the current task’s subtasks.
  subtaskInput = ''; // Temporarily holds user input for adding a new subtask.
  contactList: Contact[] = []; // A list of all contacts available to assign to a task.
  selectedContacts: Contact[] = []; // An array of contacts selected for this task.
  type: any = ''; // The type of the task (usually "todo", "inprogress", etc.).
  uncheckedImage = '/assets/icons/check_box.png'; // Paths to images representing checkbox states.
  checkedImage = '/assets/icons/check_ed.png'; // Paths to images representing checkbox states.
  isChecked = false; // Controls the checkbox state.
  priority: string | undefined; // Current priority value of the task.
  activePriority: string | undefined; // Determines which priority button is active (e.g., "urgent", "medium", "low").

  /**
   * Tracks edited Todo properties before saving.
   */
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

  /**
   * Injects required services for managing tasks, contacts, and avatar colors.
   *
   * @param todoService - Service for CRUD operations on Todo items.
   * @param contactListService - Service that provides contact data.
   * @param avatarColorService - Service for determining avatar colors.
   */
  constructor(
    private todoService: TodoListService,
    private contactListService: ContactListService,
    private avatarColorService: AvatarColorService
  ) {}

  /**
   * Lifecycle hook that subscribes to the contact list and initializes assigned contacts for the task.
   */
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

  /**
   * Toggles the 'done' state of a subtask.
   *
   * @param subtask - The subtask object whose status is toggled.
   */
  toggleCheckBox(subtask: any) {
    subtask.done = !subtask.done;
  }

  /**
   * Switches the component into editing mode and initializes editable fields.
   */
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

  /**
   * Saves changes to the currently edited Todo, then closes the overlay.
   */
  async saveTodo() {
    if (this.editedTodo && this.editedTodo.id) {
      // Update subtasks and assigned contacts
      this.editedTodo.subtasks = this.editableSubtasks;
      this.editedTodo.assignedTo = this.selectedContacts
        .map((contact) => contact.name)
        .join(', ');

      await this.todoService.updateTodo(this.editedTodo);

      // Sync component state with updated Todo
      this.todo = { ...this.editedTodo };
      this.isEditing = false;
      this.dropdownOpen = false;

      // Emit the overlay closing event and reload the page to reflect changes
      this.closeOverlay.emit();
      window.location.reload();
    }
  }

  /**
   * Deletes the current Todo item and closes the overlay.
   */
  deleteTodo() {
    if (this.todo && this.todo.id) {
      this.todoService.deleteTodo(this.todo.id).then(() => {
        this.closeOverlay.emit();
      });
    }
  }

  /**
   * Toggles a contact's selection state for assignment.
   *
   * @param contact - The contact to select or deselect.
   * @param event - The change event (checkbox toggle).
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
   * Removes a contact from the selected contacts list.
   *
   * @param contact - The contact to remove.
   */
  deleteContact(contact: Contact) {
    this.selectedContacts = this.selectedContacts.filter((c) => c !== contact);
  }

  /**
   * Retrieves the icon path based on the priority level.
   *
   * @param priority - A string representing the priority level.
   * @returns A path to the relevant icon.
   */
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

  /**
   * Determines a color code for the task's category, using a predefined mapping.
   *
   * @param category - The category name.
   * @returns A string representing the color code (hex).
   */
  getCategoryColor(category: string | null | undefined): string {
    let categoryColors: { [key: string]: string } = {
      'Technical Task': '#1FD7C1',
      'User Story': '#0038FF',
    };

    return category ? categoryColors[category] || '#CCCCCC' : '#CCCCCC';
  }

  /**
   * Retrieves a dynamically assigned avatar color for a contact.
   *
   * @param contact - The contact whose avatar color is requested.
   * @returns A color string.
   */
  getAvatarColor(contact: Contact): string {
    return this.avatarColorService.getAvatarColor(contact);
  }

  /**
   * Generates initials from the given name.
   *
   * @param name - The full name to process.
   * @returns Uppercase initials of the name.
   */
  getInitials(name: string): string {
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase();
  }

  /**
   * Sets the current priority of the edited todo and updates the active priority button styles.
   *
   * @param priority - The new priority value ('urgent', 'medium', or 'low').
   */
  setPriority(priority: string) {
    this.priority = priority;
    this.activePriority = priority;
    this.editedTodo.priority = priority;
    this.updateButtonStyles();
  }

  /**
   * Updates the button styles to highlight the currently active priority button.
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
   * Toggles the dropdown menu visibility for assigning contacts.
   */
  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  /**
   * Checks if a particular contact is currently selected for the task.
   *
   * @param contact - The contact to verify.
   * @returns `true` if the contact is in the selectedContacts array, otherwise `false`.
   */
  isSelected(contact: Contact): boolean {
    return this.selectedContacts.includes(contact);
  }

  /**
   * Rotates the dropdown arrow icon when the dropdown gains focus.
   */
  onFocus() {
    document.querySelector('.arrow-icon')?.classList.add('rotate');
  }

  /**
   * Removes the rotation from the dropdown arrow icon when it loses focus.
   */
  onBlur() {
    document.querySelector('.arrow-icon')?.classList.remove('rotate');
  }

  /**
   * Displays the subtask input controls.
   */
  activateInput() {
    this.showControls = true;
  }

  /**
   * Confirms the creation of a new subtask and adds it to the editable subtasks array.
   */
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

  /**
   * Cancels subtask creation and clears the input.
   */
  cancelSubtask() {
    this.subtaskInput = '';
    this.showControls = false;
  }

  /**
   * Delays hiding the subtask input controls to allow other interactions (e.g., button clicks).
   */
  hideControls() {
    if (this.subtaskInput.trim() === '') {
      setTimeout(() => {
        this.showControls = false;
      }, 200);
    }
  }

  /**
   * Removes a subtask from the editable subtasks array by index.
   *
   * @param index - The index of the subtask to delete.
   */
  deleteSubtask(index: number) {
    this.editableSubtasks.splice(index, 1);
  }

  /**
   * Enables editing mode for a specific subtask.
   *
   * @param index - The index of the subtask to edit.
   */
  editSubtask(index: number) {
    this.editedSubtaskIndex = index;
    this.editedSubtaskValue = this.editableSubtasks[index].title;
  }

  /**
   * Saves an edited subtask and exits edit mode.
   *
   * @param index - The index of the subtask being edited.
   */
  saveSubtask(index: number) {
    if (this.editedSubtaskValue.trim() !== '') {
      this.editableSubtasks[index].title = this.editedSubtaskValue.trim();
      this.cancelEdit();
    }
  }

  /**
   * Cancels subtask edit mode and clears temporary input values.
   */
  cancelEdit() {
    this.editedSubtaskIndex = null;
    this.editedSubtaskValue = '';
  }
}
