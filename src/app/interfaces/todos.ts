export interface Todo {
    id?: string;
    type: 'todo';
    title: string;
    description: string;
    assignedTo: string;
    dueDate: string;
    priority: string;
    category: string;
    subtasks: string[];
}
