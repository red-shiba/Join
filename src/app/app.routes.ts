import { Routes } from '@angular/router';
import { ContactsComponent } from './main-content/contacts/contacts.component';
import { PrivacyPolicyComponent } from './shared/legal/privacy-policy/privacy-policy.component';
import { LegalNoticeComponent } from './shared/legal/legal-notice/legal-notice.component';
import { HelpSectionComponent } from './shared/legal/help-section/help-section.component';
import { BoardComponent } from './main-content/board/board.component';
import { AddTaskComponent } from './main-content/add-task/add-task.component';
import { SummaryComponent } from './main-content/summary/summary.component';

export const routes: Routes = [
  { path: 'contacts', component: ContactsComponent },
  { path: 'privacypolicy', component: PrivacyPolicyComponent },
  { path: 'legalnotice', component: LegalNoticeComponent },
  { path: 'helpsection', component: HelpSectionComponent },
  { path: 'board', component: BoardComponent },
  { path: 'add-task', component: AddTaskComponent },
  { path: 'summary', component: SummaryComponent },
];
