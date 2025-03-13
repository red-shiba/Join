/**
 * SingleTodoComponent - Represents an individual task in the task board.
 * 
 * This component:
 * - Displays task details such as priority, category, and assigned contacts.
 * - Computes avatar colors and initials for assigned contacts.
 * - Tracks the progress of subtasks.
 */

import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Todo } from '../../../interfaces/todos';
import { Contact } from '../../../interfaces/contact';
import { TodoListService } from '../../../firebase-service/todo-list.service';
import { ContactListService } from '../../../firebase-service/contact-list.service';
import { AvatarColorService } from '../../../services/avatar-color.service';

/**
 * Single task component.
 * 
 * - **Displays task details** such as title, priority, and assigned contacts.
 * - **Manages subtasks** and tracks their completion status.
 * - **Generates avatar colors and initials** for assigned contacts.
 */
@Component({
  selector: 'app-single-todo',
  standalone: true,
  providers: [TodoListService],
  templateUrl: './single-todo.component.html',
  styleUrl: './single-todo.component.scss',
  imports: [CommonModule],
})
export class SingleTodoComponent implements OnInit {
  @Input() todo: Todo | null = null; // The task object passed as an input from the parent component.
  contactList: Contact[] = []; // List of all available contacts.
  selectedContacts: Contact[] = []; // List of contacts assigned to this task.

  /**
   * Initializes the component with required services.
   * 
   * @param contactListService - Service for retrieving contacts.
   * @param avatarColorService - Service for generating avatar colors.
   */
  constructor(
    private contactListService: ContactListService,
    private avatarColorService: AvatarColorService
  ) {}

  /**
   * Lifecycle hook that runs when the component initializes.
   * - Fetches the list of contacts.
   * - Matches assigned contacts based on task details.
   */
  ngOnInit() {
    this.contactListService.getContacts().subscribe((contacts) => {
      this.contactList = contacts;

      if (this.todo?.assignedTo) {
        const assignedNames = this.todo.assignedTo
          .split(', ')
          .map((name) => name.trim());
        this.selectedContacts = this.contactList.filter((contact) =>
          assignedNames.includes(contact.name)
        );
      }
    });
  }

  /**
   * Retrieves the avatar color for a contact.
   * 
   * @param contact - The contact whose avatar color should be determined.
   * @returns A hex color string for the contact's avatar.
   */
  getAvatarColor(contact: Contact): string {
    return this.avatarColorService.getAvatarColor(contact);
  }

  /**
   * Extracts initials from a given name.
   * 
   * @param name - The full name of the contact.
   * @returns Initials in uppercase.
   */
  getInitials(name: string): string {
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase();
  }

  /**
   * Retrieves the appropriate priority icon for a task.
   * 
   * @param priority - The priority level (`urgent`, `medium`, `low`).
   * @returns A path to the corresponding priority icon.
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
        return ''; // Fallback for invalid values
    }
  }

  /**
   * Retrieves the color associated with a task category.
   * 
   * @param category - The category name.
   * @returns A hex color string for the category.
   */
  getCategoryColor(category: string | null | undefined): string {
    let categoryColors: { [key: string]: string } = {
      'Technical Task': '#1FD7C1',
      'User Story': '#0038FF',
    };

    return category ? categoryColors[category] || '#CCCCCC' : '#CCCCCC';
  }

  /**
   * Computes the total number of subtasks for this task.
   */
  get totalSubtasks(): number {
    return this.todo?.subtasks?.length || 0;
  }

  /**
   * Computes the number of completed subtasks.
   */
  get completedSubtasks(): number {
    if (!this.todo?.subtasks) return 0;
    return this.todo.subtasks.filter((sub) => sub.done).length;
  }

  /**
   * Determines if all subtasks are completed.
   * 
   * @returns `true` if all subtasks are completed, otherwise `false`.
   */
  get allSubtasksDone(): boolean {
    return this.totalSubtasks > 0 && this.completedSubtasks === this.totalSubtasks;
  }
}
