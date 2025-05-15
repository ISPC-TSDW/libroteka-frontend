import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule, AbstractControl } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { CreateService } from './create.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-create',
  standalone: true,
  imports: [ReactiveFormsModule, RouterModule, CommonModule],
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css']
})
export class CreateComponent {
  form!: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';
  showConfirmPassMessage: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private createService: CreateService,
    private authService: AuthService,
    private router: Router
  ) {
    this.form = this.formBuilder.group({
      username: ['', [Validators.required, Validators.minLength(3), Validators.maxLength(20)]],
      first_name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(30), Validators.pattern('[a-zA-ZáéíóúÁÉÍÓÚñÑ\\s]+')]],
      last_name: ['', [Validators.required, Validators.minLength(2), Validators.maxLength(35), Validators.pattern('[a-zA-ZáéíóúÁÉÍÓÚñÑ\\s]+')]],
      dni: ['', [Validators.required, Validators.minLength(7), Validators.maxLength(11), Validators.pattern('[0-9]+')]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, this.validateStrongPassword]],
      confirmpass: ['', [Validators.required]],
    }, { validators: this.checkPasswords });
  }

  // Validador personalizado para contraseña fuerte
  validateStrongPassword(control: AbstractControl): { [key: string]: boolean } | null {
    const value = control.value;
    if (!value) return null;

    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumber = /\d/.test(value);
    const hasSpecialChar = /[@$!%*?&/#\-_.]/.test(value);
    const isValidLength = value.length >= 12;

    if (!isValidLength) {
      return { strongPassword: true };
    }
    if (!hasUpperCase) {
      return { strongPassword: true };
    }
    if (!hasLowerCase) {
      return { strongPassword: true };
    }
    if (!hasNumber) {
      return { strongPassword: true };
    }
    if (!hasSpecialChar) {
      return { strongPassword: true };
    }

    return null;
  }

  // Validador para verificar que las contraseñas coincidan
  checkPasswords(group: FormGroup): { [key: string]: boolean } | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmpass')?.value;
    return password === confirmPassword ? null : { notSame: true };
  }

  // Getters para acceder fácilmente a los campos del formulario
  get Username() {
    return this.form.get('username');
  }

  get FirstName() {
    return this.form.get('first_name');
  }

  get LastName() {
    return this.form.get('last_name');
  }

  get dni() {
    return this.form.get('dni');
  }

  get Email() {
    return this.form.get('email');
  }

  get Password() {
    return this.form.get('password');
  }

  get ConfirmPass() {
    return this.form.get('confirmpass');
  }

  // Acción de envío del formulario
  onEnviar(event: Event): void {
    event.preventDefault();
    if (this.form.valid) {
      const { confirmpass, ...formData } = this.form.value;

      this.createService.registerUser(formData).subscribe(
        (response) => {
          const { access, refresh } = response;
          this.authService.storeTokens(access, refresh);
          this.successMessage = 'Registro exitoso. Redirigiendo al dashboard...';
          this.errorMessage = '';
          this.router.navigate(['/dashboard']);
        },
        (error) => {
          this.errorMessage = 'No se pudo crear el registro, revisa las observaciones.';
          console.error(error);
        }
      );
    } else {
      this.errorMessage = 'No se pudo crear el registro, revisa las observaciones.';
      this.form.markAllAsTouched();
    }
  }

  ConfirmPassMsg(event: Event): void {
    this.showConfirmPassMessage = true;
  }
}
