/**
 * AuthService - Manages user authentication and profile updates via Firebase.
 *
 * This service provides:
 * - Methods for registering, logging in, and logging out users.
 * - Observables to track the user's authentication state.
 * - Profile and Firestore interaction to store and update user data.
 */
import { Injectable } from '@angular/core';
import { updateProfile } from '@angular/fire/auth';
import { Firestore, doc, setDoc } from '@angular/fire/firestore';
import {
  Auth,
  signInWithEmailAndPassword,
  createUserWithEmailAndPassword,
  signOut,
  user
} from '@angular/fire/auth';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  /**
   * An observable that emits the currently authenticated user or null if not authenticated.
   */
  user$: Observable<any>;

  /**
   * Initializes the service with the AngularFire Auth and Firestore instances.
   * Subscribes to user state changes using the Firebase user observable.
   *
   * @param auth - The AngularFire Auth instance for authentication tasks.
   * @param firestore - The AngularFire Firestore instance for database operations.
   */
  constructor(private auth: Auth, private firestore: Firestore) {
    // Firebase automatically provides the user's status (authenticated or not).
    this.user$ = user(auth);
  }

  /**
   * Logs the user in with the provided email and password.
   *
   * @param email - The user's email address.
   * @param password - The user's password.
   * @returns A promise that resolves with the user credentials upon successful login.
   */
  login(email: string, password: string) {
    return signInWithEmailAndPassword(this.auth, email, password);
  }

  /**
   * Logs the current user out of the application.
   *
   * @returns A promise that resolves once the user is logged out.
   */
  logout() {
    return signOut(this.auth);
  }

  /**
   * Returns an observable that emits a boolean indicating whether a user is logged in.
   *
   * @returns An observable of type boolean, `true` if a user is authenticated, otherwise `false`.
   */
  isLoggedIn$(): Observable<boolean> {
    return new Observable<boolean>((observer) => {
      this.user$.subscribe((user) => {
        observer.next(!!user);
      });
    });
  }

  /**
   * Registers a new user with the provided name, email, and password.
   * Updates the user's profile and stores user data in Firestore.
   *
   * @param name - The display name for the new user.
   * @param email - The new user's email address.
   * @param password - The new user's password.
   * @returns A promise that resolves to user credentials upon successful registration.
   */
  async register(name: string, email: string, password: string) {
    const userCredential = await createUserWithEmailAndPassword(this.auth, email, password);
  
    if (userCredential.user) {
      await updateProfile(userCredential.user, { displayName: name });
      await this.saveUserToFirestore(userCredential.user);
    }
  
    return userCredential;
  }

  /**
   * Updates the authenticated user's display name.
   *
   * @param user - The currently authenticated user object.
   * @param name - The new display name to set.
   * @returns A promise that resolves once the user profile has been updated.
   */
  async updateProfile(user: any, name: string) {
    return updateProfile(user, { displayName: name });
  }

  /**
   * Saves the user's information (UID, display name, email) to Firestore.
   *
   * @param user - The user object containing UID, display name, and email.
   */
  async saveUserToFirestore(user: any) {
    if (!user) return;
  
    const userRef = doc(this.firestore, `users/${user.uid}`);
    await setDoc(userRef, {
      uid: user.uid,
      name: user.displayName,
      email: user.email
    });
  }

  /**
   * Retrieves the currently authenticated user from Firebase Auth.
   *
   * @returns The current user object, or `null` if none is authenticated.
   */
  getCurrentUser() {
    return this.auth.currentUser;
  }
}
