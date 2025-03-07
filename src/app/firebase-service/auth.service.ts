import { Injectable } from '@angular/core';
import { updateProfile } from '@angular/fire/auth';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import { Auth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, user } from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  user$: Observable<any>;

  constructor(private auth: Auth, private firestore: Firestore) {
    this.user$ = user(auth); // Firebase liefert automatisch den User-Status
  }

  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  logout() {
    return signOut(this.auth);
  }

  isLoggedIn$(): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      this.user$.subscribe((user) => {
        observer.next(!!user);
      });
    });
  }

  async register(name: string, email: string, password: string) {
    const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
  
    if (userCredential.user) {
      await updateProfile(userCredential.user, { displayName: name });
      await this.saveUserToFirestore(userCredential.user);
    }
  
    return userCredential;
  }

  async updateProfile(user: any, name: string) {
    return updateProfile(user, { displayName: name });
  }

  async saveUserToFirestore(user: any) {
    if (!user) return;
  
    const userRef = doc(this.firestore, `users/${user.uid}`);
    await setDoc(userRef, {
      uid: user.uid,
      name: user.displayName,
      email: user.email
    });
  }

  getCurrentUser() {
    return this.auth.currentUser; // Gibt den aktuellen User zurück
  }
}

