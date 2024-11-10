import { Component, OnDestroy, Signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTableModule } from '@angular/material/table';
import { Subject, take, takeUntil } from 'rxjs';
import { Task } from '../../models/models';
import { FilterPipe } from '../../pipes/filter.pipe';
import { StatesService } from '../../services/states.service';
import { AddDialogComponent } from '../add-dialog/add-dialog.component';

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [
    MatTableModule,
    FilterPipe,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss'
})
export class TableComponent implements OnDestroy {
  displayedColumns = ['title', 'status', 'dueDate', 'operation'];

  tasks: Signal<Task[]>;

  statusFilter: Signal<string | null>;

  unsubscribeAll$ = new Subject<void>();

  constructor(
    private dialog: MatDialog,
    private statesService: StatesService,
    private matSnackBar: MatSnackBar,
  ) {
    this.tasks = this.statesService.getTaskItems();
    this.statusFilter = this.statesService.getStatusFilter();
  }

  openDialog(task: Task): void {
    const dialogRef = this.dialog.open(AddDialogComponent, {
      panelClass: ['glo3d-dialog-container'],
      maxWidth: '576px',
      width: '100%',
      autoFocus: false,
      data: task
    });

    dialogRef.afterClosed().pipe(
      take(1),
      takeUntil(this.unsubscribeAll$),
    ).subscribe(result => {
      if (result) {
        this.openSnackBar(`${result} has been successfully added`);
      }
    });
  }

  openSnackBar(message: string, state: 'danger' | 'success' = 'success') {
    this.matSnackBar.open(message, '', {
      panelClass: [state],
      duration: 3000,
      verticalPosition: 'bottom',
    });
  }

  remove(task: Task): void {
    if (confirm(`Are you sure you want to delete ${task.title}?`)) {
      this.statesService.removeItem(task);
    }
  }

  unsubscribeAll(): void {
    this.unsubscribeAll$.next();
    this.unsubscribeAll$.complete();
  }

  ngOnDestroy(): void {
    this.unsubscribeAll();
  }
}
