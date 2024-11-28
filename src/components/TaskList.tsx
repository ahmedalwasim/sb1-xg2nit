import React from 'react';
import { Task } from '../types/task';
import { TaskCard } from './TaskCard';

interface TaskListProps {
  tasks: Task[];
  onEditTask: (task: Task) => void;
  onDeleteTask: (taskId: string) => void;
}

export const TaskList: React.FC<TaskListProps> = ({
  tasks,
  onEditTask,
  onDeleteTask,
}) => {
  return (
    <div className="space-y-4">
      {tasks.length === 0 ? (
        <p className="text-center text-gray-500">No tasks yet. Add one above!</p>
      ) : (
        tasks.map((task) => (
          <TaskCard
            key={task.id}
            task={task}
            onEdit={onEditTask}
            onDelete={onDeleteTask}
          />
        ))
      )}
    </div>
  );
};