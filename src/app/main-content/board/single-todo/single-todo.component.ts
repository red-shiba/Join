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

  getPriorityIcon(priority: string | null | undefined): string {
    switch (priority) {
      case 'urgent':
        return '/assets/icons/prio_high.png';
      case 'medium':
        return '/assets/icons/prio_medium.png';
      case 'low':
        return '/assets/icons/prio_low.png';
      default:
        return ''; // Fallback für ungültige Werte
    }
  }
}
