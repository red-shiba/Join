/**
 * SummaryComponent - Displays an overview of the user's tasks and a greeting message.
 * 
 * This component provides:
 * - A personalized greeting based on the time of day.
 * - Animated text effects on page load.
 * - An overview of task categories, including urgent tasks and their nearest due dates.
 */

import { Component, HostListener, OnInit, Input } from '@angular/core';
import { AuthService } from '../../firebase-service/auth.service';
import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { Todo } from '../../interfaces/todos';
import { TodoListService } from '../../firebase-service/todo-list.service';

/**
 * Summary component.
 * 
 * - **Displays the user's name and greeting message**.
 * - **Shows an overview of tasks in different categories**.
 * - **Animates an introduction text upon page load**.
 */
@Component({
  selector: 'app-summary',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './summary.component.html',
  styleUrl: './summary.component.scss',
  animations: [
    trigger('moveText', [
      state(
        'center',
        style({
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          opacity: 1,
          backgroundColor: '#f6f7f8',
        })
      ),
      state(
        'moved',
        style({
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          opacity: 0,
          backgroundColor: 'transparent',
        })
      ),
      transition('center => moved', animate('1s ease-in-out')),
    ]),
    trigger('fadeIn', [transition(':enter', [style({ opacity: 1 })])]),
  ],
})
export class SummaryComponent implements OnInit {
  @Input() todo!: Todo; // Task object received as an input property.
  displayName: string | null = ''; // The display name of the logged-in user.
  greeting: string = ''; // Greeting message based on the time of day.
  textState: 'center' | 'moved' = 'center'; // State of the animated introduction text.
  isMobileView: boolean = false; // Determines whether the application is in mobile view.
  urgentNearestDueDate: string | null = null; // Stores the nearest due date of urgent tasks.
  showText: boolean = true; // Controls whether the introduction text is visible.

  /**
   * Arrays storing tasks based on their statuses.
   */
  todoList: Todo[] = [];
  awaitFeedbackList: Todo[] = [];
  inProgressList: Todo[] = [];
  doneList: Todo[] = [];


  /**
   * Initializes authentication and task services.
   * 
   * @param authService - Authentication service instance.
   * @param todoListService - Service that handles task data.
   */
  constructor(
    private authService: AuthService,
    private todoListService: TodoListService
  ) {}

  /**
   * Lifecycle hook that runs when the component initializes.
   * - Retrieves the user's display name.
   * - Sets the greeting message.
   * - Animates the introduction text.
   */
  ngOnInit() {
    const user = this.authService.getCurrentUser();
    if (user) {
      this.displayName = user.displayName;
    }
    this.greeting = this.getGreeting();

    setTimeout(() => {
      this.textState = 'moved';
    }, 2000);

    setTimeout(() => {
      this.showText = false;
    }, 3000);
  }

  /**
   * Generates a greeting message based on the time of day.
   * 
   * @returns A greeting string (e.g., "Good Morning", "Good Afternoon", "Good Evening").
   */
  getGreeting(): string {
    const hour = new Date().getHours();

    if (hour >= 5 && hour < 12) {
      return 'Good Morning';
    } else if (hour >= 12 && hour < 18) {
      return 'Good Afternoon';
    } else {
      return 'Good Evening';
    }
  }

  /**
   * Retrieves a list of tasks based on the list ID.
   * 
   * @param listId - The ID of the task list.
   * @returns An array of tasks from the corresponding list.
   */
  getList(listId: string): Todo[] {
    switch (listId) {
      case 'todoList':
        return this.todoListService.todos || [];
      case 'awaitFeedbackList':
        return this.todoListService.awaitfeedbacks || [];
      case 'inProgressList':
        return this.todoListService.inprogress || [];
      case 'doneList':
        return this.todoListService.done || [];
      default:
        return [];
    }
  }

  /**
   * Calculates the total number of tasks across all lists.
   * 
   * @returns The total number of tasks.
   */
  totalMatches(): number {
    let totalMatches = 0;
    totalMatches += this.getList('todoList').length;
    totalMatches += this.getList('awaitFeedbackList').length;
    totalMatches += this.getList('inProgressList').length;
    totalMatches += this.getList('doneList').length;
    return totalMatches;
  }

  /**
   * Counts the number of urgent tasks.
   * 
   * @returns The number of tasks marked as urgent.
   */
  totalUrgent() {
    let allTodos = [
      this.getList('todoList'),
      this.getList('awaitFeedbackList'),
      this.getList('inProgressList'),
      this.getList('doneList'),
    ].flat();
    const urgentTodos = allTodos.filter((todo) => todo.priority === 'urgent');
    this.getNearestDueDate(allTodos);
    return urgentTodos.length;
  }

  /**
   * Finds the nearest due date for urgent tasks.
   * 
   * @param allTodos - An array of all tasks.
   * @returns The nearest due date in `DD.MM.YYYY` format, or `null` if no urgent tasks exist.
   */
  getNearestDueDate(
    allTodos: { priority: string; dueDate: string }[]
  ): string | null {
    const urgentTodos = allTodos.filter((todo) => todo.priority === 'urgent');

    if (urgentTodos.length === 0) return null;

    urgentTodos.sort((a, b) => {
      const dateA = new Date(a.dueDate).getTime();
      const dateB = new Date(b.dueDate).getTime();
      return dateA - dateB;
    });

    const nearestDate = new Date(urgentTodos[0].dueDate);
    const formattedDate = `${nearestDate
      .getDate()
      .toString()
      .padStart(2, '0')}.${(nearestDate.getMonth() + 1)
      .toString()
      .padStart(2, '0')}.${nearestDate.getFullYear()}`;
    this.urgentNearestDueDate = formattedDate;
    return formattedDate;
  }
}
