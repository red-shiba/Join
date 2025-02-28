import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Todo } from '../../../interfaces/todos';
import { Contact } from '../../../interfaces/contact';
import { TodoListService } from '../../../firebase-service/todo-list.service';
import { ContactListService } from '../../../firebase-service/contact-list.service';
import { AvatarColorService } from '../../../services/avatar-color.service';

@Component({
  selector: 'app-single-todo',
  standalone: true,
  providers: [TodoListService],
  templateUrl: './single-todo.component.html',
  styleUrl: './single-todo.component.scss',
  imports: [CommonModule], // <--- CommonModule importieren
})
export class SingleTodoComponent implements OnInit {
  @Input() todo: Todo | null = null;

  contactList: Contact[] = [];
  selectedContacts: Contact[] = [];

  constructor(
    private contactListService: ContactListService,
    private avatarColorService: AvatarColorService
  ) {}

  ngOnInit() {
    this.contactListService.getContacts().subscribe((contacts) => {
      this.contactList = contacts;

      if (this.todo?.assignedTo) {
        const assignedNames = this.todo.assignedTo
          .split(', ')
          .map((name) => name.trim());
        this.selectedContacts = this.contactList.filter((contact) =>
          assignedNames.includes(contact.name)
        );
      }
    });
  }

  getAvatarColor(contact: Contact): string {
    return this.avatarColorService.getAvatarColor(contact);
  }

  getInitials(name: string): string {
    return name
      .split(' ')
      .map((word) => word[0])
      .join('')
      .toUpperCase();
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
        return ''; // Fallback für ungültige Werte
    }
  }
  getCategoryColor(category: string | null | undefined): string {
    let categoryColors: { [key: string]: string } = {
      'Technical Task': '#1FD7C1',
      'User Story': '#0038FF',
    };

    return category ? categoryColors[category] || '#CCCCCC' : '#CCCCCC'; // falls die Kategorie nicht in der Liste ist, wird ein Grauton zurückgegeben
  }
}
