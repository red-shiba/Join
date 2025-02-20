import { Injectable, inject } from '@angular/core';
import { Todo } from '../interfaces/todos';
import { Firestore, addDoc, deleteDoc, collection, collectionData, doc, onSnapshot, updateDoc } from '@angular/fire/firestore';

@Injectable({
  providedIn: 'root'
})
export class TodoListService {
  todos: Todo[] = [];

  unsubTodos;

  firestore: Firestore = inject(Firestore);

  constructor() {
    this.unsubTodos = this.subTodoList();
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
         return 'todo';
       } else {
         return 'todo';
       }
     }
   
     async addTodo(todo: {}) {
       await addDoc(this.getTodoRef(), todo).catch(
         (error) => { console.error(error) }
       ).then(
         (docRef) => {console.log('Document written with ID: ', docRef?.id);});
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
     }
   
     subTodoList() {
       return onSnapshot(this.getTodoRef(), (list) => {
         this.todos = [];
         list.forEach((element) => {
           this.todos.push(this.setTodoObject(element.data(), element.id));
         });
       });
     }
   
     getTodoRef() {
       return collection(this.firestore, 'todo');
     }
   
     getSingleDocRef(colId: string, docId: string) {
       return doc(collection(this.firestore, colId), docId);
     }
}
