import { Component, Input } from '@angular/core';
import { Todo } from '../../../interfaces/todos';
import { TodoListService } from '../../../firebase-service/todo-list.service';

@Component({
  selector: 'app-single-todo',
  standalone: true,
  providers: [TodoListService],
  templateUrl: './single-todo.component.html',
  styleUrl: './single-todo.component.scss',
})
export class SingleTodoComponent {
  constructor(private todoListService: TodoListService) {}
  @Input() todo: Todo | null = null;

  getList(): Todo[] {
    return this.todoListService.todos;
  }
}
