import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { InterestFormService } from '../../interest-form.service';
import { CreateInterestFormDTO } from '../../../../shared/models/form.model';
import { CommonModule, NgIf } from '@angular/common';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

@Component({
  selector: 'app-interest-form',
  imports: [
    CommonModule,
    NgIf,
    ReactiveFormsModule,
    MatDialogModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatSnackBarModule,
  ],
  templateUrl: './interest-form.html',
  styleUrl: './interest-form.css',
})
export class InterestForm {
  data = inject<{ productId: string; productName: string }>(MAT_DIALOG_DATA);
  ref = inject(MatDialogRef<InterestForm>);
  private fb = inject(FormBuilder);
  private service = inject(InterestFormService);
  snack = inject(MatSnackBar);

  sending = false;

  form = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    email: ['', [Validators.required, Validators.email]],
    phone: [''],
    message: [''],
  });

  submit() {
    if (this.form.invalid) return;
    this.sending = true;
    const formData = {
      ...this.form.value,
      interestedProduct: this.data?.productId,
    } as CreateInterestFormDTO;
    this.service.createInterestForm(formData).subscribe({
      next: () => {
        this.snack.open('Consulta enviada', 'Cerrar', { duration: 2500 });
        this.sending = false;
        this.close(true);
      },
      error: () => {
        this.snack.open('No se pudo enviar el formulario', 'Cerrar', { duration: 3000 });
        this.sending = false;
      },
    });
  }

  close(ok: boolean = false) {
    this.ref.close(ok);
  }
}
