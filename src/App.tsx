import React, { useState } from 'react';
import { TaskForm } from './components/TaskForm';
import { TaskList } from './components/TaskList';
import { Task } from './types/task';
import { useTasks } from './hooks/useTasks';

function App() {
  const { tasks, addTask, updateTask, deleteTask } = useTasks();
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const handleEditTask = (task: Task) => {
    setEditingTask(task);
  };

  const handleUpdateTask = (updatedTask: Omit<Task, 'id'>) => {
    if (editingTask) {
      updateTask({ ...updatedTask, id: editingTask.id });
      setEditingTask(null);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="mx-auto max-w-3xl px-4">
        <h1 className="mb-8 text-center text-3xl font-bold text-gray-900">
          Task Management
        </h1>
        
        <div className="mb-8 rounded-lg bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">
            {editingTask ? 'Edit Task' : 'Add New Task'}
          </h2>
          <TaskForm
            onSubmit={editingTask ? handleUpdateTask : addTask}
            initialData={editingTask || undefined}
            buttonText={editingTask ? 'Update Task' : 'Add Task'}
          />
        </div>

        <div className="rounded-lg bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-xl font-semibold text-gray-900">Your Tasks</h2>
          <TaskList
            tasks={tasks}
            onEditTask={handleEditTask}
            onDeleteTask={deleteTask}
          />
        </div>
      </div>
    </div>
  );
}

export default App;