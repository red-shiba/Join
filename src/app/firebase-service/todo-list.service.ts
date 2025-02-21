import { Injectable, inject } from '@angular/core';
import { Todo } from '../interfaces/todos';
import { Firestore, query, limit, addDoc, deleteDoc, collection, collectionData, doc, onSnapshot, updateDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class TodoListService {
  todos: Todo [] = [];
  awaitfeedbacks: Todo [] = [];

  unsubTodos;
  unsubAwaitfeedbacks;

  firestore: Firestore = inject(Firestore);

  constructor() {
    this.unsubTodos = this.subTodosList();
    this.unsubAwaitfeedbacks = this.subAwaitfeedbackList();
   }

   async deleteTodo(colId: "todo", docId: string) {
       await deleteDoc(this.getSingleDocRef(colId, docId)).catch(
         (err) => {console.log(err)}
       )
     }
   
     async updateTodo(todo: Todo) {
       if(todo.id) {
         let docRef = this.getSingleDocRef(this.getColIdFromTodo(todo), todo.id)
         await updateDoc(docRef, this.getCleanJson(todo)).catch(
           (error) => { console.error(error) }
         );
       }
     }
   
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
       if(todo.type === 'todo') {
         return 'todos';
       } else {
         return 'awaitfeedback';
       }
     }

    async addTodo(item: Todo, colId: "todos" | "awaitfeedback") {
      if (colId === "awaitfeedback") {
        await addDoc(this.getAwaitfeedbackRef(), item).catch(
          (err) => { console.error(err) }
        ).then(
          (docRef) => { console.log("Document written with ID: ", docRef?.id) }
        );
      } else {
        await addDoc(this.getTodosRef(), item).catch(
          (err) => { console.error(err) }
        ).then(
          (docRef) => { console.log("Document written with ID: ", docRef?.id) }
        );
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
     }

     subAwaitfeedbackList() {
      return onSnapshot(this.getTodosRef(), (list) => {
        this.awaitfeedbacks = [];
        list.forEach((element) => {
          this.awaitfeedbacks.push(this.setTodoObject(element.data(), element.id));
        });
      });
    }
   
    //  subTodosList() {
    //    return onSnapshot(this.getTodosRef(), (list) => {
    //      this.todos = [];
    //      list.forEach((element) => {
    //        this.todos.push(this.setTodoObject(element.data(), element.id));
    //      });
    //    });
    //  }

    subTodosList() {
      const q = query(this.getTodosRef(), limit(100));
      return onSnapshot(q, (list) => {
        this.todos = [];
        list.forEach(element => {
          this.todos.push(this.setNoteObject(element.data(), element.id));
        });
        list.docChanges().forEach((change) => {
          if (change.type === "added") {
              console.log("New note: ", change.doc.data());
          }
          if (change.type === "modified") {
              console.log("Modified note: ", change.doc.data());
          }
          if (change.type === "removed") {
              console.log("Removed note: ", change.doc.data());
          }
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
   
     getSingleDocRef(colId: string, docId: string) {
       return doc(collection(this.firestore, colId), docId);
     }
}
