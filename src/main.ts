/**
 * Main entry point of the Angular application.
 * This file bootstraps the application and configures the required providers.
 */

import { bootstrapApplication } from '@angular/platform-browser';
import { provideAnimations } from '@angular/platform-browser/animations';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { routes } from './app/app.routes';

/**
 * Initializes and starts the Angular application.
 * 
 * Configures:
 * - Angular Router with predefined routes
 * - Animation support for Angular components
 * - Firestore (Firebase database)
 * - Firebase Authentication
 * - Firebase App initialization with project-specific settings
 */
bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes), // Sets up the application routing
    provideAnimations(), // Enables Angular animations
    provideFirestore(() => getFirestore()), // Provides Firestore database
    provideFirebaseApp(() => initializeApp({
      apiKey: "AIzaSyAKiGyjJcby5rNm0DZxTz60Wxx3RNJFFlg",
      authDomain: "join-1f579.firebaseapp.com",
      projectId: "join-1f579",
      storageBucket: "join-1f579.firebasestorage.app",
      messagingSenderId: "469475899953",
      appId: "1:469475899953:web:b77dd590afa4dfeab3f310"
    })), // Initializes Firebase app with project credentials
    provideAuth(() => getAuth()) // Provides Firebase authentication services
  ]
}).catch(err => console.error(err)); // Handles errors if the application fails to start
