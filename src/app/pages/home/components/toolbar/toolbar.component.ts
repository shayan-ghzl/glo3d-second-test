import { Component, OnDestroy } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Subject, take, takeUntil } from 'rxjs';
import { TaskStatus } from '../../models/models';
import { StatesService } from '../../services/states.service';
import { AddDialogComponent } from '../add-dialog/add-dialog.component';

@Component({
  selector: 'app-toolbar',
  standalone: true,
  imports: [
    MatButtonModule,
    MatSelectModule
  ],
  templateUrl: './toolbar.component.html',
  styleUrl: './toolbar.component.scss'
})
export class ToolbarComponent implements OnDestroy {

  taskStatusTypes = Object.values(TaskStatus).filter(key => isNaN(Number(key)));

  unsubscribeAll$ = new Subject<void>();

  constructor(
    private dialog: MatDialog,
    private statesService: StatesService,
    private matSnackBar: MatSnackBar,
  ) { }

  openDialog(): void {
    const dialogRef = this.dialog.open(AddDialogComponent, {
      panelClass: ['glo3d-dialog-container'],
      maxWidth: '576px',
      width: '100%',
      autoFocus: false,
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

  setFilter(status: string | null): void {
    this.statesService.setStatusFilter(status);
  }

  unsubscribeAll(): void {
    this.unsubscribeAll$.next();
    this.unsubscribeAll$.complete();
  }

  ngOnDestroy(): void {
    this.unsubscribeAll();
  }
}
