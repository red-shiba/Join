/**
 * ContactListService - Manages a collection of contacts stored in Firestore.
 *
 * This service provides:
 * - CRUD operations (create, read, update, delete) for contact records.
 * - Real-time updates through Firestore snapshots, populating the local `contacts` array.
 * - Utility methods for reference management and data transformation.
 */
import { inject, Injectable } from '@angular/core';
import { Contact } from '../interfaces/contact';
import {
  Firestore,
  addDoc,
  deleteDoc,
  collection,
  collectionData,
  doc,
  onSnapshot,
  updateDoc
} from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactListService {
  contacts: Contact[] = []; // Local cache of contacts, updated in real-time by the Firestore snapshot subscription.
  unsubContacts: () => void; // A function that unsubscribes from Firestore snapshot changes.
  firestore: Firestore = inject(Firestore); // The injected Firestore instance.

  /**
   * Initializes Firestore snapshot subscription for contacts.
   */
  constructor() {
    this.unsubContacts = this.subContactList();
  }

  /**
   * Deletes a contact document from Firestore by collection and document ID.
   *
   * @param colId - The name of the collection (e.g. 'contact').
   * @param docId - The ID of the document to remove.
   */
  async deleteContact(colId: 'contact', docId: string) {
    await deleteDoc(this.getSingleDocRef(colId, docId)).catch((err) =>
      console.log(err)
    );
  }

  /**
   * Updates an existing contact document in Firestore.
   *
   * @param contact - The contact object to update. Must contain an `id` for the existing document.
   */
  async updateContact(contact: Contact) {
    if (contact.id) {
      const docRef = this.getSingleDocRef(
        this.getColIdFromContact(contact),
        contact.id
      );
      await updateDoc(docRef, this.getCleanJson(contact)).catch((error) =>
        console.error(error)
      );
    }
  }

  /**
   * Prepares a Firestore-ready JSON object from the given contact.
   *
   * @param contact - The contact to transform.
   * @returns A plain object containing only the essential fields.
   */
  getCleanJson(contact: Contact): {} {
    return {
      type: contact.type,
      name: contact.name,
      email: contact.email,
      phone: contact.phone,
    };
  }

  /**
   * Determines which Firestore collection ID should be used for a given contact type.
   *
   * @param contact - A contact object to inspect.
   * @returns A collection ID string (currently always 'contact').
   */
  getColIdFromContact(contact: Contact) {
    if (contact.type === 'contact') {
      return 'contact';
    } else {
      return 'contact';
    }
  }

  /**
   * Retrieves an observable stream of Contact documents from Firestore.
   *
   * @returns An Observable array of contacts, each with an added `id` field from Firestore.
   */
  getContacts(): Observable<Contact[]> {
    return collectionData(this.getContactRef(), { idField: 'id' }) as Observable<
      Contact[]
    >;
  }

  /**
   * Adds a new contact document to the Firestore 'contact' collection.
   *
   * @param contact - A plain object representing the contact fields to store.
   */
  async addContact(contact: {}) {
    await addDoc(this.getContactRef(), contact)
      .catch((error) => {
        console.error(error);
      })
      .then((docRef) => {
        console.log('Document written with ID: ', docRef?.id);
      });
  }

  /**
   * Builds a strongly typed Contact object from raw Firestore data.
   *
   * @param obj - The raw data object from Firestore.
   * @param id - The Firestore document ID.
   * @returns A fully typed Contact object.
   */
  setContactObject(obj: any, id: string): Contact {
    return {
      id: id,
      type: obj.type || 'contact',
      name: obj.name || '',
      email: obj.email || '',
      phone: obj.phone || '',
    };
  }

  /**
   * Cleans up the Firestore snapshot subscription.
   * Should be called upon component or service destruction.
   */
  ngonDestroy() {
    this.unsubContacts();
  }

  /**
   * Subscribes to the Firestore 'contact' collection. Updates the local `contacts` array in real-time.
   *
   * @returns A function to unsubscribe from the snapshot listener.
   */
  subContactList() {
    return onSnapshot(this.getContactRef(), (list) => {
      this.contacts = [];
      list.forEach((element) => {
        this.contacts.push(this.setContactObject(element.data(), element.id));
      });
    });
  }

  /**
   * Retrieves a Firestore collection reference for 'contact'.
   *
   * @returns A CollectionReference pointing to the 'contact' collection.
   */
  getContactRef() {
    return collection(this.firestore, 'contact');
  }

  /**
   * Retrieves a specific document reference by collection ID and document ID.
   *
   * @param colId - The collection name to target (e.g. 'contact').
   * @param docId - The Firestore document ID to reference.
   * @returns A DocumentReference pointing to the specified document.
   */
  getSingleDocRef(colId: string, docId: string) {
    return doc(collection(this.firestore, colId), docId);
  }
}
