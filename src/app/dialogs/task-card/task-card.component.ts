import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-task-card',
  standalone: true,
  imports: [],
  templateUrl: './task-card.component.html',
  styleUrl: './task-card.component.scss',
})
export class TaskCardComponent {
  @Output() closeOverlay = new EventEmitter<boolean>();
  isClosing = false;

  close() {
    this.closeOverlay.emit();
  }
}
