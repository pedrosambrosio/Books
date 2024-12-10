import { BASE_URL, getApiUrl, logApiCall } from '../lib/utils';

export const TaskService = {
  async getTasks() {
    const url = getApiUrl('/tasks');
    logApiCall(url);
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  },

  async createTask(task: any) {
    const url = getApiUrl('/tasks');
    logApiCall(url);
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(task),
    });
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    return await response.json();
  }
};