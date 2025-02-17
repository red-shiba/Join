import { Routes } from '@angular/router';
import { ContactsComponent } from './main-content/contacts/contacts.component';
import { PrivacyPolicyComponent } from './shared/legal/privacy-policy/privacy-policy.component';
import { LegalNoticeComponent } from './shared/legal/legal-notice/legal-notice.component';
import { HelpSectionComponent } from './shared/legal/help-section/help-section.component';

export const routes: Routes = [
  { path: '', component: ContactsComponent },
  { path: 'privacyPolicy', component: PrivacyPolicyComponent },
  { path: 'LegalNotice', component: LegalNoticeComponent },
  { path: 'HelpSection', component: HelpSectionComponent}
];
