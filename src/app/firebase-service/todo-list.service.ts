import { Injectable, inject } from '@angular/core';
import { Todo } from '../interfaces/todos';
import { Firestore, query, limit, addDoc, deleteDoc, collection, collectionData, doc, onSnapshot, updateDoc } from '@angular/fire/firestore';
import { BehaviorSubject } from 'rxjs';
import { getDoc } from "@angular/fire/firestore";

@Injectable({
  providedIn: 'root'
})
export class TodoListService {
  private todosSubject = new BehaviorSubject<Todo[]>([]);
  todos$ = this.todosSubject.asObservable();
  todos: Todo [] = [];
  awaitfeedbacks: Todo [] = [];
  inprogress: Todo [] = [];
  done: Todo [] = [];

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

   async deleteTodo(colId: "todo" | "inprogress" | "awaitfeedback" | "done", docId: string) {
       await deleteDoc(this.getSingleDocRef(colId, docId)).catch(
         (err) => {console.log(err)}
       )
     }

     async updateTodo(todo: Todo) {
      if (!todo.id) return;
    
      const docRef = doc(this.firestore, `${todo.type}/${todo.id}`);
      const docSnap = await getDoc(docRef);
    
      if (!docSnap.exists()) {
        console.warn("Dokument existiert nicht:", todo.type, todo.id);
        return; // Keine Aktualisierung durchführen
      }
    
      await updateDoc(docRef, { ...todo }).catch(error =>
        console.error("Fehler beim Update:", error)
      );
    }

    //  async updateTodo(todo: Todo) {
    //    if(todo.id) {
    //      let docRef = this.getSingleDocRef(this.getColIdFromTodo(todo), todo.id)
    //      await updateDoc(docRef, this.getCleanJson(todo)).catch(
    //        (error) => { console.error(error) }
    //      );
    //    }
    //  }
   
     getCleanJson(todo: Todo):{} {
       return {
         type: todo.type,
         title: todo.title,
         description: todo.description,
         assignedTo: todo.assignedTo,
         dueDate: todo.dueDate,
         priority: todo.priority,
         category: todo.category,
         subtasks: todo.subtasks,
     }
   }
   
   getColIdFromTodo(todo: Todo) {
    return todo.type; // Gibt "todo", "inprogress", "awaitfeedback" oder "done" zurück
  }

  async addTodo(item: Todo, colId: "todo" | "inprogress" | "awaitfeedback" | "done") {
    try {
      const docRef = await addDoc(collection(this.firestore, colId), item);
      console.log(`✅ Task wurde in "${colId}" gespeichert mit ID:`, docRef.id);
    } catch (err) {
      console.error(`❌ Fehler beim Speichern in "${colId}":`, err);
    }
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
          this.awaitfeedbacks.push(this.setTodoObject(element.data(), element.id));
        });
      });
    }
    
    subInprogressList() {
      return onSnapshot(this.getInprogressRef(), (list) => {
        this.inprogress = [];
        if (list.empty) {  //  Wenn keine Einträge vorhanden sind
          console.warn("Keine Tasks in 'inprogress'.");
          this.inprogress = [];  // Stelle sicher, dass es nicht undefined ist
        } else {
          list.forEach((element) => {
            this.inprogress.push(this.setTodoObject(element.data(), element.id));
          });
        }
        this.todosSubject.next(this.inprogress);  // 🔄 Update Observable
      });
    }

    subDoneList(){
      return onSnapshot(this.getDoneRef(), (list) => { 
        this.done = [];
        list.forEach((element) => {
          this.done.push(this.setTodoObject(element.data(), element.id));
        });
      });
    }

     setNoteObject(obj: any, id: string): Todo {
      return {
        id: id,
        type: obj.type || 'todo',
        title: obj.title || "",
        description: obj.description || "",
        assignedTo: obj.assignedTo || "",
        dueDate: obj.dueDate || "",
        priority: obj.priority || "",
        category: obj.category || "",
        subtasks: obj.subtasks || "",
      }
    }
   
     getTodosRef() {
       return collection(this.firestore, 'todo');
     }

     getAwaitfeedbackRef() {
      return collection(this.firestore, 'awaitfeedback')
     }

     getInprogressRef() {
      return collection(this.firestore, 'inprogress')
     }

     getDoneRef() {
      return collection(this.firestore, 'done')
     }
   
     getSingleDocRef(colId: string, docId: string) {
      return doc(collection(this.firestore, colId), docId);
    }
    
}
