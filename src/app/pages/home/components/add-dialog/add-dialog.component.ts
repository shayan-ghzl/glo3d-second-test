import { Component, Inject, NgZone, Optional } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { _closeDialogVia, MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { Task, TaskStatus } from '../../models/models';
import { StatesService } from '../../services/states.service';

@Component({
  selector: 'app-add-dialog',
  standalone: true,
  imports: [
    MatDialogModule,
    MatIconModule,
    MatInputModule,
    MatSelectModule,
    ReactiveFormsModule,
    MatProgressSpinner,
    MatDatepickerModule,
    MatButtonModule
  ],
  templateUrl: './add-dialog.component.html',
  styleUrl: './add-dialog.component.scss'
})
export class AddDialogComponent {

  taskStatusTypes = Object.values(TaskStatus).filter(key => isNaN(Number(key)));

  startDate = new Date();
  minDate = new Date('1996/01/01');
  maxDate = new Date('2026/01/01');

  formGroup = new FormGroup({
    title: new FormControl('', [Validators.required]),
    status: new FormControl('', [Validators.required]),
    dueDate: new FormControl('', [Validators.required]),
  });

  private _loading = false;
  get loading(): boolean {
    return this._loading;
  }
  set loading(v: boolean) {
    this._loading = v;
    if (v) {
      this.formGroup.disable();
    } else {
      this.formGroup.enable();
    }
  }

  constructor(
    private statesService: StatesService,
    private ngZone: NgZone,
    @Optional() public dialogRef: MatDialogRef<any>,
    @Inject(MAT_DIALOG_DATA) public data: Task | null
  ) {
    if (this.data) {
      const { title, status, dueDate } = this.data;
      this.formGroup.setValue({ title, status, dueDate });
    }
  }

  addOrEdit(): void {
    if (this.formGroup.invalid || this.formGroup.pristine || this.loading) {
      return;
    }
    this.loading = true;

    const value = this.formGroup.value as { title: string; status: 'Pending' | 'Progress' | 'Completed'; dueDate: string; };

    this.ngZone.run(() => {
      setTimeout(() => {
        if (this.data) {
          this.statesService.editItem({ ...value, id: this.data.id });
        } else {
          this.statesService.addItem({ ...value, id: this.statesService.lastAddedId });
        }
        _closeDialogVia(this.dialogRef, 'mouse', value.title);
      }, 1000);
    });

  }
}
