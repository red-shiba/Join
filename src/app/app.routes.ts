/**
 * Defines the application's routing configuration.
 * This file specifies the available routes, their components, 
 * and authentication guards where necessary.
 */

import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { LoginLayoutComponent } from './loginLayout/login-layout.component';
import { authGuard } from './auth.guard';
import { ContactsComponent } from './main-content/contacts/contacts.component';
import { PrivacyPolicyComponent } from './shared/legal/privacy-policy/privacy-policy.component';
import { LegalNoticeComponent } from './shared/legal/legal-notice/legal-notice.component';
import { HelpSectionComponent } from './shared/legal/help-section/help-section.component';
import { BoardComponent } from './main-content/board/board.component';
import { AddTaskComponent } from './main-content/add-task/add-task.component';
import { SummaryComponent } from './main-content/summary/summary.component';
import { MainFrameComponent } from './main-frame/main-frame.component';
import { SignupComponent } from './signup/signup.component';
import { LoginNaviFrameComponent } from './login-navi-frame/login-navi-frame.component';

/**
 * Application routes configuration.
 * 
 * - `login` route: Displays the login screen with optional signup.
 * - `legal` route: Shows legal information pages like Privacy Policy and Legal Notice.
 * - Protected routes (require authentication via `authGuard`): Includes the dashboard, contacts, board, etc.
 * - `**` (wildcard route): Redirects unknown paths to the login page.
 */
export const routes: Routes = [
  {
    path: 'login',
    component: LoginLayoutComponent,
    children: [
      { path: '', component: LoginComponent },
      { path: 'signup', component: SignupComponent },
    ],
  },

  {
    path: 'legal',
    component: LoginNaviFrameComponent,
    children: [
      { path: 'privacypolicy', component: PrivacyPolicyComponent },
      { path: 'legalnotice', component: LegalNoticeComponent },
    ],
  },

  {
    path: '',
    component: MainFrameComponent,
    canActivate: [authGuard], // Protects internal pages
    children: [
      { path: 'board', component: BoardComponent },
      { path: 'contacts', component: ContactsComponent },
      { path: 'summary', component: SummaryComponent },
      { path: 'helpsection', component: HelpSectionComponent },
      { path: 'add-task', component: AddTaskComponent },
      { path: 'privacypolicy', component: PrivacyPolicyComponent },
      { path: 'legalnotice', component: LegalNoticeComponent },
      { path: '', redirectTo: 'summary', pathMatch: 'full' }, // Default page
    ],
  },

  { path: '**', redirectTo: 'login' }, // Redirect unknown routes to login
];
