import { Component } from '@angular/core';
import { Validators, ReactiveFormsModule, FormGroup, FormBuilder } from '@angular/forms';
import { RouterLink, RouterOutlet } from '@angular/router';
import { CreateService } from './create.service'; // Asegúrate de que la ruta es correcta
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-create',
  standalone: true,
imports: [ReactiveFormsModule, RouterLink, RouterOutlet, CommonModule],
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.css'],
})
export class CreateComponent {
  form!: FormGroup;
  successMessage: string = '';
  errorMessage: string = '';

  constructor(private formBuilder: FormBuilder, private createService: CreateService) {
    this.form = this.formBuilder.group(
      {
        username: [
          '',
          [
            Validators.required,
            Validators.minLength(3),
            Validators.maxLength(20),
            Validators.pattern(/^[a-zA-Z0-9]+$/),
          ],
        ],
        
        
        first_name: [
          '',
          [
            Validators.required,
            Validators.minLength(2),
            Validators.maxLength(30),
            Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s']+/),
          ],
        ],
         last_name: [
          '',
          [
            Validators.required,
            Validators.minLength(2),
            Validators.maxLength(35),
            Validators.pattern(/^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s']+/),
          ],
        ],
        dni: [
          '',
          [
            Validators.required,
            Validators.minLength(6),
            Validators.maxLength(10),
            Validators.pattern(/^[0-9]+/),
          ],
        ],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(8)]],
        confirmpass: ['', [Validators.required, Validators.minLength(8)]],
      },
      { validators: this.checkPasswords }
    );
  }
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

  onEnviar(event: Event) {
    event.preventDefault();
    if (this.form.valid) {
      console.log(this.form.value);
      this.createService.registerUser(this.form.value).subscribe(
        response => {
          this.successMessage = 'Recibirá un correo electrónico con los datos del registro';
          this.errorMessage = '';
        },
        error => {
          this.errorMessage = 'No se pudo crear el registro, revisa las observaciones.';
          console.error(error);
        }
      );
    } else {
      this.errorMessage = 'No se pudo crear el registro, revisa las observaciones.';
      this.form.markAllAsTouched();
    }
  }

  checkPasswords(group: FormGroup) {
    const pass = group.get('password')?.value;
    const confirmPass = group.get('confirmpass')?.value;
    if (pass && confirmPass && pass !== confirmPass) {
      group.get('confirmpass')?.setErrors({ notSame: true });
    } else {
      group.get('confirmpass')?.setErrors(null);
    }
    return null;
  }

  showConfirmPassMessage = false;
  ConfirmPassMsg(event: any) {
    this.showConfirmPassMessage = true;
  }
}
