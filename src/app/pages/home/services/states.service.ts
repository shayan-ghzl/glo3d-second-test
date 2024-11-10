import { computed, effect, Injectable, signal } from '@angular/core';
import { Task } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class StatesService {
  private statusFilter = signal<string | null>(null);

  private taskItems = signal<Task[]>(JSON.parse(localStorage.getItem('glo3d-tasks') || '[]'));
  
  maxId = computed(() => {
    const tasks = this.taskItems();
    return tasks.length > 0 ? (Math.max(...tasks.map(task => task.id)) + 1) : 1;
  });

  syncStorage = effect(() => {
    localStorage.setItem('glo3d-tasks', JSON.stringify(this.taskItems()));
  });

  getTaskItems() {
    return this.taskItems.asReadonly();
  }

  editItem(updatedTask: Task) {
    this.taskItems.update(items =>
      items.map(task =>
        task.id === updatedTask.id ? { ...task, ...updatedTask } : task
      )
    );
  }

  addItem(task: Task) {
    this.taskItems.update(items => [...items, task]);
  }

  removeItem(task: Task) {
    this.taskItems.update(items => items.filter(item => item.id !== task.id));
  }

  clearTasks() {
    this.taskItems.set([]);
  }

  getStatusFilter() {
    return this.statusFilter.asReadonly();
  }

  setStatusFilter(status: string | null) {
    this.statusFilter.set(status);
  }
}
