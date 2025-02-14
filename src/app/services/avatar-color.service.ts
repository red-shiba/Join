import { Injectable } from '@angular/core';
import { Contact } from '../interfaces/contact';

@Injectable({
  providedIn: 'root', // Dadurch wird der Service global verfügbar
})
export class AvatarColorService {
  getAvatarColor(contact: Contact): string {
    let hash = 0;
    for (let i = 0; i < contact.email.length; i++) {
      hash = contact.email.charCodeAt(i) + ((hash << 5) - hash);
    }
    let color = '#';
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 255;
      color += ('00' + value.toString(16)).slice(-2);
    }
    return color;
  }
}

