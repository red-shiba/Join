import { inject, Injectable } from '@angular/core';
import { Contact } from '../interfaces/contact';
import { Firestore, addDoc, collection, collectionData, doc, onSnapshot } from '@angular/fire/firestore';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ContactListService {
  contacts: Contact[] = [];

  unsubContacts;

  firestore: Firestore = inject(Firestore);

  constructor() { 
    this.unsubContacts = this.subContactList();

  }

  async addContact(contact: {}) {
    await addDoc(this.getContactRef(), contact).catch(
      (error) => { console.error(error) }
    ).then(
      (docRef) => {console.log('Document written with ID: ', docRef?.id);});
  }

  setContactObject(obj: any, id: string): Contact {
    return {
      id: id,
      type: obj.type || 'contact',
      name: obj.name || '',
      email: obj.email || '',
      phone: obj.phone || 0,
    };
  }

  ngonDestroy() {
    this.unsubContacts();
  }

  subContactList() {
    return onSnapshot(this.getContactRef(), (list) => {
      this.contacts = [];
      list.forEach((element) => {
        this.contacts.push(this.setContactObject(element.data(), element.id));
      });
    });
  }

  getContactRef() {
    return collection(this.firestore, 'contact');
  }

  getSingleDocRef(colId: string, docId: string) {
    return doc(collection(this.firestore, colId), docId);
  }
    
}
