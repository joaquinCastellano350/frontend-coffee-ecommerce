import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

export interface ConfirmDialogData {
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
}
@Component({
  selector: 'app-confirm-dialog-component',
  imports: [CommonModule, MatDialogModule, MatButtonModule],
  templateUrl: './confirm-dialog-component.html',
  styleUrl: './confirm-dialog-component.css',
})
export class ConfirmDialogComponent {
  ref = inject(MatDialogRef<ConfirmDialogComponent, boolean>);
  data = inject<ConfirmDialogData>(MAT_DIALOG_DATA);
}
