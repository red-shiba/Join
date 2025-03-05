import { Component, Input } from '@angular/core';
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
    AddTaskDialogComponent
  ],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
})
export class BoardComponent {
  @Input() todo!: Todo;
  todoList: Todo[] = [];
  awaitFeedbackList: Todo[] = [];
  inProgressList: Todo[] = [];
  doneList: Todo[] = [];
  isOverlayOpen = false;
  selectedTodo: Todo | null = null;
  searchTerm: string = '';
  isDialogOpen = false;
  preselectedType: string | null = null;

  constructor(private todoListService: TodoListService) {}

  ngOnInit() {
    this.todoListService.todos$.subscribe((todos) => {
      this.todoList = todos;
    });
  }

  onSearchChange(value: string) {
    this.searchTerm = value;
  }

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

  getFilteredList(listId: string): Todo[] {
    const allTodos = this.getList(listId);

    if (!this.searchTerm) {
      return allTodos;
    }

    const lowerSearchTerm = this.searchTerm.toLowerCase();

    return allTodos.filter((todo) => {
      const title = todo.title?.toLowerCase() || '';
      const description = todo.description?.toLowerCase() || '';
      return (
        title.includes(lowerSearchTerm) ||
        description.includes(lowerSearchTerm)
      );
    });
  }

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

  drop(
    event: CdkDragDrop<Todo[]>,
    newCategory: 'todo' | 'inprogress' | 'awaitfeedback' | 'done'
  ) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      const movedTodo = event.previousContainer.data[event.previousIndex];

      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );

      // Setze die neue Kategorie im lokalen Zustand
      movedTodo.type = newCategory;

      // Firebase-Update
      this.todoListService
        .moveTodo(movedTodo, newCategory)
        .then(() => console.log('Task erfolgreich in Firestore aktualisiert'))
        .catch((err) => console.error('Fehler beim Firebase-Update:', err));
    }
  }

  openOverlay(todo: Todo) {
    this.selectedTodo = todo; // speichert das ausgewählte Todo-Objekt
    this.isOverlayOpen = true;
  }

  closeOverlay() {
    this.isOverlayOpen = false;
  }

  openDialog(type: string) {
    this.preselectedType = type;
    this.isDialogOpen = true;
  }

  closeDialog(event: boolean) {
    this.isDialogOpen = false;
    this.preselectedType = null;
  }
}
