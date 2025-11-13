import { Component, computed, effect, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import {  ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth.services';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatCard } from "@angular/material/card";
import { WishlistService } from '../../wishlist/wishlist.service';


@Component({
  standalone: true,
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule, MatFormFieldModule, MatInputModule, MatButtonModule, MatCard, RouterLink],
  templateUrl: './login.page.html',
  styleUrls: ['./login.page.css']
})
export class LoginPage {
  private fb = inject(FormBuilder);
  private router = inject(Router);
  private route = inject(ActivatedRoute)
  private snack = inject(MatSnackBar);
  private authService = inject(AuthService);
  
  mode = signal<'login' | 'register'>('login');
  isRegister = computed(() => this.mode() === 'register');
  loading = false;
  
  form = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    password: ['', [Validators.required, Validators.minLength(8)]],
    confirm: ['']
  },
  {validators: (): ReturnType<typeof Validators.required> | null => this.isRegister() && this.form
    ? (this.form.controls['password'].value === this.form.controls['confirm'].value ? null : {mismatch: true})
    : null
  }
);

private registerModeEffect = effect(() => {
    const register = this.isRegister();
    const confirmControl = this.form.controls['confirm'];
    if (register) {
      confirmControl.setValidators([Validators.required, Validators.minLength(8)]);
    } else {
      confirmControl.clearValidators();
      confirmControl.setValue('');
    }
    confirmControl.updateValueAndValidity({emitEvent: false});
    this.form.updateValueAndValidity({emitEvent: false});
  });
  ngOnInit() {
    const routeMode = this.route.snapshot.data['mode'] as 'login' | 'register' | undefined;
    if (routeMode) {
      this.mode.set(routeMode);
    }
  }

  toggleMode() {
    this.mode.set(this.isRegister() ? 'login' : 'register');
  }

  async onSubmit() {
    if (this.form.invalid || this.loading) {
      return;
    }
    if (this.isRegister()) {
      this.loading = true;
      const { email, password } = this.form.value as { email: string; password: string; };
      try {
        await this.authService.register(email, password);
        this.snack.open('Registro exitoso! Ahora podés iniciar sesión', 'Cerrar', { duration: 3000 });
        this.mode.set('login');
      } catch (error) {
        this.snack.open('Error en el registro. Probá nuevamente.', 'Cerrar', { duration: 3000 });
      } finally {
        this.loading = false;
      }
      return;
    }
    this.loading = true;
    const { email, password } = this.form.value as { email: string; password: string; };
    try {
      await this.authService.login(email, password);
      this.authService.refreshSession();
      this.snack.open('Inicio de sesión exitoso', 'Cerrar', { duration: 3000 });
      this.router.navigate(['/']);
    } catch (error) {
      this.snack.open('Credenciales Invalidas', 'Cerrar', { duration: 3000 });
    } finally {
      this.loading = false;
    }
  }
}