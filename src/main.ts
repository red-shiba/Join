import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { provideRouter } from '@angular/router';
import { provideFirebaseApp, initializeApp } from '@angular/fire/app';
import { provideFirestore, getFirestore } from '@angular/fire/firestore';
import { provideAuth, getAuth } from '@angular/fire/auth';
import { routes } from './app/app.routes';

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideFirestore(() => getFirestore()),
    provideFirebaseApp(() => initializeApp({
      apiKey: "AIzaSyBL8izQfHbRN7EjrpWck12XccJxEZkwFUs",
      authDomain: "join-68f95.firebaseapp.com",
      projectId: "join-68f95",
      storageBucket: "join-68f95.firebasestorage.app",
      messagingSenderId: "378653092670",
      appId: "1:378653092670:web:7877bf9d17c833d9abda6f"
    })),
    provideAuth(() => getAuth())
  ]
}).catch(err => console.error(err));
