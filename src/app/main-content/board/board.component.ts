import { Component } from '@angular/core';
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

@Component({
  selector: 'app-board',
  standalone: true,
  imports: [
    CdkDropList,
    CdkDrag,
    FormsModule,
    CommonModule,
    SingleTodoComponent,
  ],
  templateUrl: './board.component.html',
  styleUrl: './board.component.scss',
})
export class BoardComponent {
  [x: string]: unknown;
  todoList: Todo[] = [];

  constructor(private todoListService: TodoListService) {}

  getList(): Todo[] {
    return this.todoListService.todos;
  }

  drop(event: CdkDragDrop<string[]>) {
    if (event.previousContainer === event.container) {
      moveItemInArray(
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    } else {
      transferArrayItem(
        event.previousContainer.data,
        event.container.data,
        event.previousIndex,
        event.currentIndex
      );
    }
  }
}
