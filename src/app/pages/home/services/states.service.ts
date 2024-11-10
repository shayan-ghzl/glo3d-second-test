import { Injectable, signal } from '@angular/core';
import { Task } from '../models/models';

@Injectable({
  providedIn: 'root'
})
export class StatesService {
  lastAddedId = 1;

  private statusFilter = signal<string | null>(null);

  private taskItems = signal<Task[]>([]);

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
    this.lastAddedId = this.lastAddedId + 1;
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
