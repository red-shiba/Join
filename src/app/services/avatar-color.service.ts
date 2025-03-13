/**
 * AvatarColorService - Generates a unique avatar background color based on a contact's email address.
 * 
 * This service ensures that each contact gets a distinct and consistent avatar color.
 */

import { Injectable } from '@angular/core';
import { Contact } from '../interfaces/contact';

/**
 * Provides a method to generate a unique color for a contact's avatar.
 * 
 * - **Creates a color hash** based on the contact's email.
 * - **Ensures consistency** so that the same email always results in the same color.
 */
@Injectable({
  providedIn: 'root', // Makes this service globally available
})
export class AvatarColorService {
  /**
   * Generates a unique avatar color for a given contact.
   * 
   * The color is derived from the contact's email using a hashing algorithm.
   * 
   * @param contact - The contact for which the avatar color should be generated.
   * @returns A hexadecimal color string (e.g., `#a3b1c4`).
   */
  getAvatarColor(contact: Contact): string {
    let hash = 0;
    
    // Generate a hash value from the contact's email address.
    for (let i = 0; i < contact.email.length; i++) {
      hash = contact.email.charCodeAt(i) + ((hash << 5) - hash);
    }

    let color = '#';

    // Convert hash to a 3-byte (RGB) hex color.
    for (let i = 0; i < 3; i++) {
      const value = (hash >> (i * 8)) & 255;
      color += ('00' + value.toString(16)).slice(-2);
    }

    return color;
  }
}
