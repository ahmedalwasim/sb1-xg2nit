export interface Task {
  id: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'todo' | 'in-progress' | 'done';
  priority: 'low' | 'medium' | 'high';
}