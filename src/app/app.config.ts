import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { initializeApp, provideFirebaseApp } from '@angular/fire/app';
import { getFirestore, provideFirestore } from '@angular/fire/firestore';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

export const appConfig: ApplicationConfig = {
  providers: [provideRouter(routes), provideFirebaseApp(() => initializeApp({"projectId":"join-68f95","appId":"1:378653092670:web:7a001b250209e8f3abda6f","storageBucket":"join-68f95.firebasestorage.app","apiKey":"AIzaSyBL8izQfHbRN7EjrpWck12XccJxEZkwFUs","authDomain":"join-68f95.firebaseapp.com","messagingSenderId":"378653092670"})), provideFirestore(() => getFirestore()), provideAnimationsAsync()]
};
