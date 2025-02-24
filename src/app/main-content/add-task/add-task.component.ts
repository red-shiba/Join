import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Todo } from '../../interfaces/todos';
import { TodoListService } from '../../firebase-service/todo-list.service'; 


@Component({
  selector: 'app-add-task',
  standalone: true,
  templateUrl: './add-task.component.html',
  styleUrls: ['./add-task.component.scss'],
  imports: [CommonModule, FormsModule] // FormsModule hinzufügen!
})
export class AddTaskComponent {
  title: string = '';
  description: string = '';
  assignedTo: string = '';
  dueDate: string = '';
  priority: string = '';
  category: string = '';
  subtaskInput: string = '';
  subtasks: string[] = [];

  constructor(private todoListService: TodoListService) {}

  addAssign() {
    console.log('Assign feature not implemented yet.');
  }

  setPriority(priority: string) {
    this.priority = priority;
  }

  addSubtask() {
    if (this.subtaskInput.trim()) {
      this.subtasks.push(this.subtaskInput.trim());
      this.subtaskInput = '';
    }
  }

  addTodo() {
    console.log("🔵 addTodo() wurde aufgerufen!");

    if (!this.title || !this.dueDate || !this.category) {
      console.warn("Task-Erstellung fehlgeschlagen: Fehlende Pflichtfelder!");
      return;
    }

    const newTask: Todo = {
      id: '',
      type: 'todo',
      title: this.title,
      description: this.description,
      assignedTo: this.assignedTo || '',
      dueDate: this.dueDate,
      priority: this.priority || 'low',
      category: this.category,
      subtasks: this.subtasks || [],
    };

    this.todoListService.addTodo(newTask, "todo").then(() => {
      console.log("Task erfolgreich hinzugefügt:", newTask);
    }).catch((error) => {
      console.error("Fehler beim Speichern des Tasks:", error);
    });

    // Felder zurücksetzen
    this.title = '';
    this.description = '';
    this.assignedTo = '';
    this.dueDate = '';
    this.priority = 'low';
    this.category = '';
    this.subtasks = [];
  }
  

  closeDialog() {
    console.log('Closing dialog');
  }
}
