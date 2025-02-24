import { Component, Input } from '@angular/core';
import { Todo } from '../../interfaces/todos';
import { TodoListService } from '../../firebase-service/todo-list.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import {
  CdkDragDrop,
  CdkDrag,
  CdkDropList,
  CdkDropListGroup,
  moveItemInArray,
  transferArrayItem,
} from '@angular/cdk/drag-drop';
import { SingleTodoComponent } from './single-todo/single-todo.component';
import { TaskCardComponent } from '../../dialogs/task-card/task-card.component';

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

  constructor(private todoListService: TodoListService) {}

  ngOnInit() {
    this.todoListService.todos$.subscribe((todos) => {
      this.todoList = todos;
    });
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

  drop(
    event: CdkDragDrop<Todo[]>,
    newCategory: 'todo' | 'inprogress' | 'awaitfeedback' | 'done'
  ) {
    if (event.previousContainer === event.container) {
      moveItemInArray(event.container.data, event.previousIndex, event.currentIndex);
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
  
      // Firebase-Update durchführen
      this.todoListService.moveTodo(movedTodo, newCategory)
        .then(() => console.log('Task erfolgreich in Firestore aktualisiert'))
        .catch((err) => console.error('Fehler beim Firebase-Update:', err));
    }
  }

  openOverlay() {
    this.isOverlayOpen = true;
  }

  closeOverlay() {
    this.isOverlayOpen = false;
  }
}
