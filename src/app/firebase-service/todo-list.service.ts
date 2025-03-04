import { Injectable, inject } from '@angular/core';
import { Todo } from '../interfaces/todos';
import {
  Firestore,
  query,
  setDoc,
  addDoc,
  deleteDoc,
  collection,
  collectionData,
  doc,
  onSnapshot,
  updateDoc,
} from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';
import { getDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root',
})
export class TodoListService {
  private todosSubject = new BehaviorSubject<Todo[]>([]);
  todos$ = this.todosSubject.asObservable();
  todos: Todo[] = [];
  awaitfeedbacks: Todo[] = [];
  inprogress: Todo[] = [];
  done: Todo[] = [];

  unsubTodos;
  unsubAwaitfeedbacks;
  unsubInprogress;
  unsubDone;

  firestore: Firestore = inject(Firestore);

  constructor() {
    this.unsubTodos = this.subTodosList();
    this.unsubAwaitfeedbacks = this.subAwaitfeedbackList();
    this.unsubInprogress = this.subInprogressList();
    this.unsubDone = this.subDoneList();
  }

  async addTodo(
    item: Todo,
    colId: 'todo' | 'inprogress' | 'awaitfeedback' | 'done'
  ) {
    try {
      const docRef = await addDoc(collection(this.firestore, colId), item);
      console.log(`Task wurde in "${colId}" gespeichert mit ID:`, docRef.id);
    } catch (err) {
      console.error(`Fehler beim Speichern in "${colId}":`, err);
    }
  }

  async deleteTodo(docId: string) {
    const collections = ['todo', 'inprogress', 'awaitfeedback', 'done'];

    for (const colId of collections) {
      const docRef = this.getSingleDocRef(colId, docId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        try {
          await deleteDoc(docRef);
          console.log(`Dokument ${docId} erfolgreich aus ${colId} gelöscht.`);
        } catch (err) {
          console.error(`Fehler beim Löschen von ${docId} aus ${colId}:`, err);
        }
      }
    }
  }

  async updateTodo(todo: Todo) {
    if (!todo.id) return;

    const colId = this.getColIdFromTodo(todo); // Holt den richtigen Collection-Namen

    try {
      const docRef = doc(this.firestore, `${colId}/${todo.id}`); // Dynamischer Pfad
      await updateDoc(docRef, {
        title: todo.title,
        description: todo.description,
        dueDate: todo.dueDate,
        priority: todo.priority,
        assignedTo: todo.assignedTo,
        subtasks: todo.subtasks,
        category: todo.category,
      });
      console.log('Todo erfolgreich aktualisiert');
    } catch (error) {
      console.error('Fehler beim Aktualisieren des Todos:', error);
    }
  }

  async moveTodo(
    todo: Todo,
    newStatus: 'todo' | 'inprogress' | 'awaitfeedback' | 'done'
  ) {
    if (!todo.id) return;

    // Zuerst den Task aus allen Sammlungen löschen
    await this.deleteTodo(todo.id);

    // Neuen Task in der Ziel-Sammlung erstellen
    const newDocRef = doc(this.firestore, `${newStatus}/${todo.id}`);

    try {
      await setDoc(newDocRef, { ...todo, type: newStatus });
      console.log('Task erfolgreich verschoben!');
    } catch (error) {
      console.error('Fehler beim Verschieben:', error);
    }
  }

  getCleanJson(todo: Todo): {} {
    return {
      type: todo.type,
      title: todo.title,
      description: todo.description,
      assignedTo: todo.assignedTo,
      dueDate: todo.dueDate,
      priority: todo.priority,
      category: todo.category,
      subtasks: todo.subtasks,
    };
  }

  getColIdFromTodo(todo: Todo) {
    return todo.type; // Gibt "todo", "inprogress", "awaitfeedback" oder "done" zurück
  }

  setTodoObject(obj: any, id: string): Todo {
    return {
      id: id,
      type: obj.type || 'todo',
      title: obj.title || '',
      description: obj.description || '',
      assignedTo: obj.assignedTo || '',
      dueDate: obj.dueDate || '',
      priority: obj.priority || '',
      category: obj.category || '',
      subtasks: obj.subtasks || '',
    };
  }

  ngonDestroy() {
    this.unsubTodos();
    this.unsubAwaitfeedbacks();
    this.unsubInprogress();
    this.unsubDone();
  }

  subTodosList() {
    return onSnapshot(this.getTodosRef(), (list) => {
      this.todos = [];
      list.forEach((element) => {
        this.todos.push(this.setTodoObject(element.data(), element.id));
      });
    });
  }

  subAwaitfeedbackList() {
    return onSnapshot(this.getAwaitfeedbackRef(), (list) => {
      this.awaitfeedbacks = [];
      list.forEach((element) => {
        this.awaitfeedbacks.push(
          this.setTodoObject(element.data(), element.id)
        );
      });
    });
  }

  subInprogressList() {
    return onSnapshot(this.getInprogressRef(), (list) => {
      this.inprogress = [];

      if (list.empty) {
        console.warn('Keine Tasks in "inprogress".');
      } else {
        list.forEach((element) => {
          this.inprogress.push(this.setTodoObject(element.data(), element.id));
        });
      }

      this.todosSubject.next([...this.inprogress]); // Immer aktualisieren!
    });
  }

  subDoneList() {
    return onSnapshot(this.getDoneRef(), (list) => {
      this.done = [];
      list.forEach((element) => {
        this.done.push(this.setTodoObject(element.data(), element.id));
      });
    });
  }

  getTodosRef() {
    return collection(this.firestore, 'todo');
  }

  getAwaitfeedbackRef() {
    return collection(this.firestore, 'awaitfeedback');
  }

  getInprogressRef() {
    return collection(this.firestore, 'inprogress');
  }

  getDoneRef() {
    return collection(this.firestore, 'done');
  }

  getSingleDocRef(colId: string, docId: string) {
    return doc(this.firestore, colId, docId);
  }
}
