export interface Task {
    id: number;
    title: string;
    status: 'Pending' | 'Progress' | 'Completed';
    dueDate: string;
}

export enum TaskStatus {
    Pending,
    Progress,
    Completed,
}