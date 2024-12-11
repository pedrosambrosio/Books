import { api } from './api';
import { Task } from '@/components/TaskCard';

export const TaskService = {
  getTasks: async () => {
    const response = await api.tasks.getAll();
    return response.data || [];
  },

  createTask: async (task: Omit<Task, "id">) => {
    const response = await api.tasks.create(task);
    return response.data;
  }
};

export default TaskService;