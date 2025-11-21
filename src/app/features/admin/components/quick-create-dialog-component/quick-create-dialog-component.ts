import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';

export interface QuickCreateDialogData {
  title: string;
  placeholder: string;
  confirmButtonText: string;
  value?: string;
}

@Component({
  selector: 'app-quick-create-dialog-component',
  imports: [CommonModule, MatDialogModule, ReactiveFormsModule, MatInputModule, MatButtonModule],
  templateUrl: './quick-create-dialog-component.html',
  styleUrl: './quick-create-dialog-component.css',
})
export class QuickCreateDialogComponent {
  data = inject<QuickCreateDialogData>(MAT_DIALOG_DATA);
  ref = inject(MatDialogRef<QuickCreateDialogComponent>);
  fb = inject(FormBuilder);

  f = this.fb.group({
    name: [this.data.value ?? '', [Validators.required, Validators.minLength(3)]],
  });

  close() {
    this.ref.close(null);
  }
  submit() {
    if (this.f.valid) {
      this.ref.close(this.f.value.name!.trim());
    }
  }
}
