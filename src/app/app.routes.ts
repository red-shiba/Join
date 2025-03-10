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

export const routes: Routes = [
  {
    path: 'login',
    component: LoginLayoutComponent,
    children: [
      { path: '', component: LoginComponent },
      { path: 'signup', component: SignupComponent },
      { path: 'privacypolicy', component: PrivacyPolicyComponent },
      { path: 'legalnotice', component: LegalNoticeComponent },
    ],
  },

  {
    path: '',
    component: MainFrameComponent,
    canActivate: [authGuard], // Schutz für die internen Seiten
    children: [
      { path: 'board', component: BoardComponent },
      { path: 'contacts', component: ContactsComponent },
      { path: 'summary', component: SummaryComponent },
      { path: 'helpsection', component: HelpSectionComponent },
      { path: 'add-task', component: AddTaskComponent },
      { path: 'privacypolicy', component: PrivacyPolicyComponent },
      { path: 'legalnotice', component: LegalNoticeComponent },
      { path: '', redirectTo: 'board', pathMatch: 'full' }, // Standardseite
    ],
  },

  { path: 'summary', 
    component: SummaryComponent,
    canActivate: [authGuard],
    children: [
      { path: 'board', component: BoardComponent },
    ],
  },

  { path: '**', redirectTo: 'login' },
];
