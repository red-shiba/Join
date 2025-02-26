import { Component, EventEmitter, Input, Output } from '@angular/core';
import { Todo } from '../../interfaces/todos';
import { TodoListService } from '../../firebase-service/todo-list.service';

@Component({
  selector: 'app-task-card',
  standalone: true,
  providers: [TodoListService],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.scss',
})
export class TaskCardComponent {
  @Input() todo: Todo | null = null;

  @Output() closeOverlay = new EventEmitter<boolean>();
  isClosing = false;

  uncheckedImage = '/assets/icons/check_box.png';
  checkedImage = '/assets/icons/check_ed.png';

  isChecked = false;
  
  constructor(private todoService: TodoListService) {}

  toggleCheckBox() {
    this.isChecked = !this.isChecked;
  }
  close() {
    this.closeOverlay.emit();
  }
  getPriorityIcon(priority: string | null | undefined): string {
    switch (priority) {
      case 'urgent':
        return '/assets/icons/prio_high.png';
      case 'medium':
        return '/assets/icons/prio_medium.png';
      case 'low':
        return '/assets/icons/prio_low.png';
      default:
        return ''; //alternativ wenn estwas nicht gefunden wird
    }
  }

  deleteTodo() {
    if (this.todo && this.todo.id) {
      this.todoService.deleteTodo(this.todo.id).then(() => {
        window.location.reload();
      });
    }
  }
}
