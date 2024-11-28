import React from 'react';
import { Task } from '../types/task';
import { formatDate } from '../utils/date';
import clsx from 'clsx';

interface TaskCardProps {
  task: Task;
  onEdit: (task: Task) => void;
  onDelete: (taskId: string) => void;
}

export const TaskCard: React.FC<TaskCardProps> = ({ task, onEdit, onDelete }) => {
  const priorityColors = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-yellow-100 text-yellow-800',
    high: 'bg-red-100 text-red-800',
  };

  const statusColors = {
    todo: 'bg-gray-100 text-gray-800',
    'in-progress': 'bg-blue-100 text-blue-800',
    done: 'bg-purple-100 text-purple-800',
  };

  return (
    <div className="rounded-lg border border-gray-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">{task.title}</h3>
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(task)}
            className="rounded-md bg-blue-100 px-2 py-1 text-sm text-blue-700 hover:bg-blue-200"
          >
            Edit
          </button>
          <button
            onClick={() => onDelete(task.id)}
            className="rounded-md bg-red-100 px-2 py-1 text-sm text-red-700 hover:bg-red-200"
          >
            Delete
          </button>
        </div>
      </div>
      
      <p className="mt-2 text-gray-600">{task.description}</p>
      
      <div className="mt-4 flex flex-wrap gap-2">
        <span className={clsx('rounded-full px-2 py-1 text-sm', priorityColors[task.priority])}>
          {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
        </span>
        <span className={clsx('rounded-full px-2 py-1 text-sm', statusColors[task.status])}>
          {task.status.charAt(0).toUpperCase() + task.status.slice(1)}
        </span>
        <span className="rounded-full bg-gray-100 px-2 py-1 text-sm text-gray-800">
          Due: {formatDate(task.dueDate)}
        </span>
      </div>
    </div>
  );
};