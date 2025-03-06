import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class TaskNavigationService {
  constructor(private router: Router) {}

  navigateOrOpenDialog(type: string, openDialogFn?: (type: string) => void) {
    if (window.innerWidth < 769) {
      this.router.navigate(['/add-task'], { queryParams: { type } });
    } else {
      if (openDialogFn) {
        openDialogFn(type);
      } else {
        console.warn(
          'Keine Dialogfunktion angegeben. Bildschirmbreite > 769px, mache nichts.'
        );
      }
    }
  }
}
