/**
 * BoardComponent - Manages the task board for organizing tasks into different categories.
 * 
 * This component provides:
 * - Drag-and-drop functionality to move tasks between lists.
 * - A search function to filter tasks.
 * - Task dialogs for viewing and adding tasks.
 * - Integration with Firebase for task management.
 */

import { Component, Input, HostListener } from '@angular/core';
import { Todo } from '../../interfaces/todos';
import { TodoListService } from '../../firebase-service/todo-list.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  CdkDragDrop,
  CdkDrag,
  CdkDropList,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { SingleTodoComponent } from './single-todo/single-todo.component';
import { TaskCardComponent } from '../../dialogs/task-card/task-card.component';
import { AddTaskDialogComponent } from '../../dialogs/add-task-dialog/add-task-dialog.component';
import { RouterLink, Router } from '@angular/router';
import { TaskNavigationService } from '../../services/task-navigation.service';

/**
 * Board component.
 * 
 * - **Displays task lists** and allows users to manage tasks.
 * - **Provides drag-and-drop functionality** for reordering tasks.
 * - **Allows task searching** and filtering.
 * - **Integrates with Firebase** to update task statuses.
 */
@Component({
  selector: 'app-board',
  standalone: true,
  imports: [
    CdkDropList,
    CdkDrag,
    FormsModule,
    CommonModule,
    SingleTodoComponent,
    TaskCardComponent,
    AddTaskDialogComponent,
    RouterLink
  ],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
})
export class BoardComponent {
  @Input() todo!: Todo; // Task input property.
  isOverlayOpen = false; // Indicates if the task overlay is open.
  selectedTodo: Todo | null = null; // Stores the currently selected task.
  searchTerm: string = ''; // The search term used to filter tasks.
  isDialogOpen = false; // Indicates if the add-task dialog is open.
  preselectedType: string | null = null; // Stores the preselected task type for the dialog.
  isMobile = false; // Indicates if the view is in mobile mode.

  /**
   * Arrays storing tasks based on their statuses.
   */
  todoList: Todo[] = [];
  awaitFeedbackList: Todo[] = [];
  inProgressList: Todo[] = [];
  doneList: Todo[] = [];


  /**
   * Initializes services for task management and navigation.
   * 
   * @param todoListService - Service for managing tasks.
   * @param router - Router instance for navigation.
   * @param taskNavService - Service for handling task-related navigation.
   */
  constructor(private todoListService: TodoListService, private router: Router, private taskNavService: TaskNavigationService) { }

  /**
   * Lifecycle hook that subscribes to the task list on initialization.
   */
  ngOnInit() {
    this.todoListService.todos$.subscribe((todos) => {
      this.todoList = todos;
    });
  }

  /**
   * Updates the search term for filtering tasks.
   * 
   * @param value - The new search term.
   */
  onSearchChange(value: string) {
    this.searchTerm = value;
  }

  /**
   * Retrieves the list of tasks based on the given list ID.
   * 
   * @param listId - The ID of the task list.
   * @returns An array of tasks in the corresponding list.
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
   * Retrieves a filtered list of tasks based on the search term.
   * 
   * @param listId - The ID of the task list.
   * @returns A filtered array of tasks.
   */
  getFilteredList(listId: string): Todo[] {
    const allTodos = this.getList(listId);

    if (!this.searchTerm) {
      return allTodos;
    }

    const lowerSearchTerm = this.searchTerm.toLowerCase();

    return allTodos.filter((todo) => {
      const title = todo.title?.toLowerCase() || '';
      const description = todo.description?.toLowerCase() || '';
      return title.includes(lowerSearchTerm) || description.includes(lowerSearchTerm);
    });
  }

  /**
   * Determines if no tasks match the search query.
   * 
   * @returns `true` if no tasks match the search query, otherwise `false`.
   */
  noResultsFound(): boolean {
    if (!this.searchTerm) {
      return false;
    }

    let totalMatches = 0;
    totalMatches += this.getFilteredList('todoList').length;
    totalMatches += this.getFilteredList('awaitFeedbackList').length;
    totalMatches += this.getFilteredList('inProgressList').length;
    totalMatches += this.getFilteredList('doneList').length;

    return totalMatches === 0;
  }

  /**
   * Handles the drag-and-drop event to reorder or move tasks.
   * 
   * @param event - The drag-and-drop event.
   * @param newCategory - The new category of the moved task.
   */
  drop(event: CdkDragDrop<Todo[]>, newCategory: 'todo' | 'inprogress' | 'awaitfeedback' | 'done') {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
    } else {
      const movedTodo = event.previousContainer.data[event.previousIndex];

      transferArrayItem(event.previousContainer.data, event.container.data, event.previousIndex, event.currentIndex);

      movedTodo.type = newCategory;

      this.todoListService
        .moveTodo(movedTodo, newCategory)
        .then(() => console.log('Task successfully updated in Firestore'))
        .catch((err) => console.error('Error updating task in Firestore:', err));
    }
  }

  /**
   * Handles the "+" button click to add a new task.
   * 
   * @param type - The task type to be added.
   */
  onPlusClick(type: string) {
    this.taskNavService.navigateOrOpenDialog(type, this.openDialog.bind(this));
  }

  /**
   * Opens the task overlay with the selected task.
   * 
   * @param todo - The selected task.
   */
  openOverlay(todo: Todo) {
    this.selectedTodo = todo;
    this.isOverlayOpen = true;
  }

  /**
   * Closes the task overlay.
   */
  closeOverlay() {
    this.isOverlayOpen = false;
  }

  /**
   * Opens the add-task dialog with a preselected type.
   * 
   * @param type - The task type.
   */
  openDialog(type: string) {
    this.preselectedType = type;
    this.isDialogOpen = true;
  }

  /**
   * Closes the add-task dialog.
   * 
   * @param event - Boolean indicating whether to close the dialog.
   */
  closeDialog(event: boolean) {
    this.isDialogOpen = false;
    this.preselectedType = null;
  }
}
