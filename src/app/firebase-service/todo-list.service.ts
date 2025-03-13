/**
 * TodoListService - Manages to-do items in multiple status collections with Firebase Firestore.
 *
 * This service provides:
 * - CRUD operations (Create, Read, Update, Delete) for Todo items.
 * - Real-time syncing for different status collections (e.g., 'todo', 'inprogress', 'awaitfeedback', 'done').
 * - Methods to move Todo items between collections.
 * - An internal BehaviorSubject to stream updates (e.g., for items in progress).
 */
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
  getDoc,
} from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TodoListService {
  private todosSubject = new BehaviorSubject<Todo[]>([]); // BehaviorSubject that holds the current array of Todo items.
  todos$ = this.todosSubject.asObservable(); // Observable stream of Todo items from the BehaviorSubject.

  /**
   * Arrays holding tasks of different types.
   */
  todos: Todo[] = [];
  awaitfeedbacks: Todo[] = [];
  inprogress: Todo[] = [];
  done: Todo[] = [];

  /**
   * Functions that unsubscribe from Firestore snapshot listeners.
   */
  unsubTodos: () => void;
  unsubAwaitfeedbacks: () => void;
  unsubInprogress: () => void;
  unsubDone: () => void;

  firestore: Firestore = inject(Firestore); // Injected Firestore instance for database operations.

  /**
   * Initializes snapshot subscriptions for all task collections.
   */
  constructor() {
    this.unsubTodos = this.subTodosList();
    this.unsubAwaitfeedbacks = this.subAwaitfeedbackList();
    this.unsubInprogress = this.subInprogressList();
    this.unsubDone = this.subDoneList();
  }

  /**
   * Adds a new Todo item to the specified collection in Firestore.
   *
   * @param item - The Todo item to add.
   * @param colId - One of 'todo', 'inprogress', 'awaitfeedback', or 'done'.
   */
  async addTodo(
    item: Todo,
    colId: 'todo' | 'inprogress' | 'awaitfeedback' | 'done'
  ) {
    try {
      const docRef = await addDoc(collection(this.firestore, colId), item);
      console.log(`Task saved in "${colId}" with ID:`, docRef.id);
    } catch (err) {
      console.error(`Error saving in "${colId}":`, err);
    }
  }

  /**
   * Attempts to delete a Todo item with the given docId from all possible collections.
   *
   * @param docId - The document ID of the Todo item to delete.
   */
  async deleteTodo(docId: string) {
    const collections = ['todo', 'inprogress', 'awaitfeedback', 'done'];

    for (const colId of collections) {
      const docRef = this.getSingleDocRef(colId, docId);
      const docSnap = await getDoc(docRef);

      if (docSnap.exists()) {
        try {
          await deleteDoc(docRef);
          console.log(`Document ${docId} successfully deleted from ${colId}.`);
        } catch (err) {
          console.error(`Error deleting ${docId} from ${colId}:`, err);
        }
      }
    }
  }

  /**
   * Updates an existing Todo item in Firestore based on its current 'type'.
   *
   * @param todo - The Todo object with updated properties (must include an `id`).
   */
  async updateTodo(todo: Todo) {
    if (!todo.id) return;

    const colId = this.getColIdFromTodo(todo); // Dynamically retrieves collection name

    try {
      const docRef = doc(this.firestore, `${colId}/${todo.id}`);
      await updateDoc(docRef, {
        title: todo.title,
        description: todo.description,
        dueDate: todo.dueDate,
        priority: todo.priority,
        assignedTo: todo.assignedTo,
        subtasks: todo.subtasks,
        category: todo.category,
      });
      console.log('Todo updated successfully');
    } catch (error) {
      console.error('Error updating the Todo:', error);
    }
  }

  /**
   * Moves a Todo item to a new collection (new status) by:
   * 1. Deleting the item from its current collection.
   * 2. Creating a new document in the target collection.
   *
   * @param todo - The Todo item being moved.
   * @param newStatus - The new collection name (status) for the Todo item.
   */
  async moveTodo(
    todo: Todo,
    newStatus: 'todo' | 'inprogress' | 'awaitfeedback' | 'done'
  ) {
    if (!todo.id) return;

    // First delete the task from all collections
    await this.deleteTodo(todo.id);

    // Create a new task in the target collection
    const newDocRef = doc(this.firestore, `${newStatus}/${todo.id}`);

    try {
      await setDoc(newDocRef, { ...todo, type: newStatus });
      console.log('Task moved successfully!');
    } catch (error) {
      console.error('Error moving the task:', error);
    }
  }

  /**
   * Creates a Firestore-ready JSON object from a Todo item.
   *
   * @param todo - The Todo item to transform.
   * @returns A plain object with the item's properties.
   */
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

  /**
   * Retrieves the Firestore collection ID (e.g., 'todo', 'inprogress', etc.) from a Todo item.
   *
   * @param todo - The Todo item to analyze.
   * @returns The appropriate collection ID.
   */
  getColIdFromTodo(todo: Todo) {
    return todo.type;
  }

  /**
   * Constructs a strongly typed Todo object from raw Firestore data.
   *
   * @param obj - The raw data object from Firestore.
   * @param id - The document ID associated with the data.
   * @returns A fully typed Todo object.
   */
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

  /**
   * Cleans up all subscriptions to Firestore snapshots.
   * Should be called when the service or component is destroyed.
   */
  ngonDestroy() {
    this.unsubTodos();
    this.unsubAwaitfeedbacks();
    this.unsubInprogress();
    this.unsubDone();
  }

  /**
   * Subscribes to changes in the 'todo' collection. Updates `this.todos` in real-time.
   *
   * @returns An unsubscribe function to stop listening to the snapshot.
   */
  subTodosList() {
    return onSnapshot(this.getTodosRef(), (list) => {
      this.todos = [];
      list.forEach((element) => {
        this.todos.push(this.setTodoObject(element.data(), element.id));
      });
    });
  }

  /**
   * Subscribes to changes in the 'awaitfeedback' collection. Updates `this.awaitfeedbacks` in real-time.
   *
   * @returns An unsubscribe function to stop listening to the snapshot.
   */
  subAwaitfeedbackList() {
    return onSnapshot(this.getAwaitfeedbackRef(), (list) => {
      this.awaitfeedbacks = [];
      list.forEach((element) => {
        this.awaitfeedbacks.push(this.setTodoObject(element.data(), element.id));
      });
    });
  }

  /**
   * Subscribes to changes in the 'inprogress' collection. Updates `this.inprogress` in real-time
   * and also emits the updated list via the `todosSubject`.
   *
   * @returns An unsubscribe function to stop listening to the snapshot.
   */
  subInprogressList() {
    return onSnapshot(this.getInprogressRef(), (list) => {
      this.inprogress = [];

      if (list.empty) {
        console.warn('No tasks in "inprogress".');
      } else {
        list.forEach((element) => {
          this.inprogress.push(this.setTodoObject(element.data(), element.id));
        });
      }

      // Always emit the updated list via the BehaviorSubject
      this.todosSubject.next([...this.inprogress]);
    });
  }

  /**
   * Subscribes to changes in the 'done' collection. Updates `this.done` in real-time.
   *
   * @returns An unsubscribe function to stop listening to the snapshot.
   */
  subDoneList() {
    return onSnapshot(this.getDoneRef(), (list) => {
      this.done = [];
      list.forEach((element) => {
        this.done.push(this.setTodoObject(element.data(), element.id));
      });
    });
  }

  /**
   * Retrieves a Firestore reference to the 'todo' collection.
   */
  getTodosRef() {
    return collection(this.firestore, 'todo');
  }

  /**
   * Retrieves a Firestore reference to the 'awaitfeedback' collection.
   */
  getAwaitfeedbackRef() {
    return collection(this.firestore, 'awaitfeedback');
  }

  /**
   * Retrieves a Firestore reference to the 'inprogress' collection.
   */
  getInprogressRef() {
    return collection(this.firestore, 'inprogress');
  }

  /**
   * Retrieves a Firestore reference to the 'done' collection.
   */
  getDoneRef() {
    return collection(this.firestore, 'done');
  }

  /**
   * Creates a Firestore document reference for the specified collection and document ID.
   *
   * @param colId - The Firestore collection name.
   * @param docId - The document ID within that collection.
   * @returns A reference to the specified document.
   */
  getSingleDocRef(colId: string, docId: string) {
    return doc(this.firestore, colId, docId);
  }
}
