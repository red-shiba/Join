/**
 * Application configuration file.
 * This file defines the core providers required for the Angular application,
 * including routing, Firebase services, and animations.
 */

import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

/**
 * Global application configuration.
 * 
 * Provides:
 * - **Router configuration**: Uses `routes` from `app.routes.ts`.
 * - **Firebase services**: Initializes Firebase App and Firestore.
 * - **Animations**: Enables Angular animations asynchronously.
 */
export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), // Configures application routing
    provideFirebaseApp(() =>
      initializeApp({
        projectId: 'join-1f579',
        appId: '1:469475899953:web:b77dd590afa4dfeab3f310',
        storageBucket: 'join-1f579.firebasestorage.app',
        apiKey: 'AIzaSyAKiGyjJcby5rNm0DZxTz60Wxx3RNJFFlg',
        authDomain: 'join-1f579.firebaseapp.com',
        messagingSenderId: '469475899953',
      })
    ), // Initializes Firebase with project credentials
    provideFirestore(() => getFirestore()), // Provides Firestore database
    provideAnimationsAsync(), // Enables Angular animations asynchronously
  ],
};
