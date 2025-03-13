/**
 * AddTaskComponent - Allows users to create new tasks and manage their details.
 *
 * This component provides:
 * - A form for entering task information (title, description, due date, category).
 * - Contact selection for assigning the task to one or more people.
 * - Subtask creation and editing functionalities.
 * - Priority selection and real-time validation of user inputs.
 * - Integration with Firebase for persistent task storage.
 */
import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, NgForm } from '@angular/forms';
import { Subtask, Todo } from '../../interfaces/todos';
import { TodoListService } from '../../firebase-service/todo-list.service';
import { ContactListService } from '../../firebase-service/contact-list.service';
import { Contact } from '../../interfaces/contact';
import { AvatarColorService } from '../../services/avatar-color.service';
import { Router, ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-add-task',
  standalone: true,
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss'],
  imports: [CommonModule, FormsModule],
})
export class AddTaskComponent {
  @ViewChild('taskForm') taskForm!: NgForm; // ViewChild reference to the form element for validation and control.
  title: string = ''; // Title of the new task.
  description: string = ''; // Description of the new task.
  assignedTo: string = ''; // Currently selected contact's name.
  dueDate: string = ''; // Due date for the task.
  priority: string = ''; // Priority level of the task (e.g. high, medium, low).
  activePriority: string = ''; // Indicates the active priority button for highlighting.
  category: string = ''; // Task category (e.g. "Development", "Design").
  subtaskInput: string = ''; // User input for new subtask creation.
  subtasks: Subtask[] = []; // List of all subtasks associated with the task.
  showControls: boolean = false; // Toggles the visibility of subtask controls (input and buttons).
  contactList: Contact[] = []; // List of contacts retrieved from the ContactListService.
  selectedContacts: Contact[] = []; // Array of currently selected contacts for task assignment.
  dropdownOpen = false; // Controls the open/close state of the contact dropdown.
  type: any = 'todo'; // Determines the task type for creation (e.g. "todo", "inprogress").

  /**
   * Tracks validation errors for specific form fields.
   */
  errors = {
    title: false,
    dueDate: false,
    category: false,
  };

/**
 * Checks whether the specified contact is among the currently selected contacts.
 *
 * @param contact - The contact to verify.
 * @returns `true` if the contact is in the selectedContacts array, otherwise `false`.
 */
  isSelected(contact: Contact): boolean {
    return this.selectedContacts.includes(contact);
  }

  editedSubtaskIndex: number | null = null; // Index of a subtask currently being edited.
  editedSubtaskValue: string = ''; // Temporary value for editing an existing subtask.
  showSuccessAnimation: boolean = false; // Animation toggle for a successful save operation.

  /**
   * Initializes required services and subscribes to contact data.
   *
   * @param todoListService - Service to handle CRUD operations for tasks.
   * @param contactListService - Service to retrieve and manage contact information.
   * @param avatarColorService - Service to generate avatar colors based on contact data.
   * @param router - Angular Router for navigation.
   * @param route - ActivatedRoute for accessing route parameters.
   */
  constructor(
    private todoListService: TodoListService,
    private contactListService: ContactListService,
    private avatarColorService: AvatarColorService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  /**
   * Lifecycle hook that initializes the contact list and sets default priority.
   */
  ngOnInit() {
    this.contactListService.getContacts().subscribe((contacts) => {
      this.contactList = contacts;
    });

    this.setPriority('medium');

    this.route.queryParamMap.subscribe((params) => {
      const paramVal = params.get('type');
      if (paramVal) {
        this.type = paramVal;
      }
    });
  }

  /**
   * Retrieves the global contact list from the ContactListService.
   *
   * @returns An array of Contact objects.
   */
  getList(): Contact[] {
    return this.contactListService.contacts;
  }

  /**
   * Returns a dynamic avatar color for the given contact.
   *
   * @param contact - Contact whose avatar color is requested.
   * @returns A string representing the avatar color.
   */
  getAvatarColor(contact: Contact): string {
    return this.avatarColorService.getAvatarColor(contact);
  }

  /**
   * Toggles the selection state of a contact for task assignment.
   *
   * @param contact - The contact being selected or deselected.
   * @param event - The change event from the checkbox input.
   */
  toggleContactSelection(contact: Contact, event: Event) {
    const isChecked = (event.target as HTMLInputElement).checked;
    if (isChecked) {
      this.selectedContacts.push(contact);
    } else {
      this.selectedContacts = this.selectedContacts.filter((c) => c !== contact);
    }
  }

  /**
   * Assigns a priority to the task and updates the active priority button style.
   *
   * @param priority - The new priority value.
   */
  setPriority(priority: string) {
    this.priority = priority;
    this.activePriority = priority;
    this.updateButtonStyles();
  }

  /**
   * Updates the button styles based on the active priority.
   * Used internally by setPriority().
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
   * Activates the subtask input field and related controls.
   */
  activateInput() {
    this.showControls = true;
  }

  /**
   * Confirms and adds the entered subtask to the subtask list.
   */
  confirmSubtask() {
    if (this.subtaskInput.trim() !== '') {
      this.subtasks.push({ title: this.subtaskInput.trim(), done: false });
      this.subtaskInput = '';
      this.showControls = false;
    }
  }

  /**
   * Cancels adding a new subtask and clears the input.
   */
  cancelSubtask() {
    this.subtaskInput = '';
    this.showControls = false;
  }

  /**
   * Hides subtask controls if the input is empty.
   * Uses a brief timeout for user experience.
   */
  hideControls() {
    if (this.subtaskInput.trim() === '') {
      setTimeout(() => {
        this.showControls = false;
      }, 200);
    }
  }

  /**
   * Removes a subtask from the list.
   *
   * @param index - The index of the subtask to delete.
   */
  deleteSubtask(index: number) {
    this.subtasks.splice(index, 1);
  }

  /**
   * Initiates edit mode for a selected subtask.
   *
   * @param index - The index of the subtask to edit.
   */
  editSubtask(index: number) {
    this.editedSubtaskIndex = index;
    this.editedSubtaskValue = this.subtasks[index].title;
    console.log(this.subtasks[index].title);
  }

  /**
   * Saves changes to a subtask being edited.
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
   * Cancels the subtask edit mode and clears temporary values.
   */
  cancelEdit() {
    this.editedSubtaskIndex = null;
    this.editedSubtaskValue = '';
  }

  /**
   * Validates required fields (title, due date, category).
   *
   * @returns A boolean indicating whether all required fields are valid.
   */
  validateFields(): boolean {
    this.errors.title = !this.title.trim();
    this.errors.dueDate = !this.dueDate.trim();
    this.errors.category = !this.category.trim();

    return !this.errors.title && !this.errors.dueDate && !this.errors.category;
  }

  /**
   * Saves a new task to Firebase and shows a success animation before navigating to the board.
   * If form validation fails, it marks invalid fields as touched.
   */
  addTodo() {
    if (this.taskForm.invalid) {
      Object.keys(this.taskForm.controls).forEach((key) => {
        this.taskForm.controls[key].markAsTouched();
      });
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
      .addTodo(newTask, this.type)
      .then(() => {
        this.showSuccessAnimation = true;
        setTimeout(() => {
          this.showSuccessAnimation = false;
          this.router.navigate(['board']);
        }, 2000);
      })
      .catch((error) => {
        console.error('Error while saving the task:', error);
      });
  }

  /**
   * Closes the dialog (placeholder for further dialog handling logic).
   */
  closeDialog() {
    console.log('Closing dialog');
  }

  /**
   * Generates initials (first letters) from a given name.
   *
   * @param name - The full name string to extract initials from.
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
   * Gathers and returns all first letters of contact names, sorted alphabetically.
   *
   * @returns An array of unique capital letters from the contact list.
   */
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

  /**
   * Toggles the dropdown menu's visibility for contact selection.
   */
  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
  }

  /**
   * Rotates the dropdown arrow icon on focus.
   */
  onFocus() {
    document.querySelector('.arrow-icon')?.classList.add('rotate');
  }

  /**
   * Removes the rotation from the dropdown arrow icon on blur.
   */
  onBlur() {
    document.querySelector('.arrow-icon')?.classList.remove('rotate');
  }

  /**
   * Clears all user inputs and resets the form to its initial state.
   */
  clearContent() {
    this.title = '';
    this.description = '';
    this.assignedTo = '';
    this.dueDate = '';
    this.priority = '';
    this.category = '';
    this.subtaskInput = '';
    this.subtasks = [];
    this.showControls = false;
    this.selectedContacts = [];
    this.errors = {
      title: false,
      dueDate: false,
      category: false,
    };

    this.taskForm.resetForm();
  }
}
