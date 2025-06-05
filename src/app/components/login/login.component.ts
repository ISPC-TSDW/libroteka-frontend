import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoginService } from './login.service';
import { AuthService } from '../../services/auth.service';
import { UserRoleService } from '../../services/user-role.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterModule],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  form!: FormGroup;
  errorMessage: string = '';
  showPassword = false;

  constructor(
    private formBuilder: FormBuilder,
    private loginService: LoginService,
    private authService: AuthService,
    private userRoleService: UserRoleService,
    private router: Router
  ) {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.maxLength(32)]]
    });
  }

  get Email() {
    return this.form.get('email');
  }

  get Password() {
    return this.form.get('password');
  }
  
  onSubmit(): void {
    if (this.form.valid) {
      this.loginService.loginUser(this.form.value).subscribe(
        (response) => {
          const { access, refresh } = response;
          if (access && refresh) {
            this.authService.storeTokens(access, refresh);
            this.userRoleService.getUserDetails(
              this.form.value.email, 
              this.form.value.password
            ).subscribe(
              (userDetails) => {
                this.authService.storeUserDetails(userDetails);
                if (this.authService.hasRole(2)) {
                  this.router.navigate(['/admin/books']);
                } else {
                  this.router.navigate(['/inicio']);
                }
              },
              (error) => {
                // Si falla obtener detalles, igual navega
                this.router.navigate(['/inicio']);
              }
            );
          } else {
            this.errorMessage = 'Respuesta inválida del servidor.';
          }
        },
        (error) => {
          this.errorMessage = 'Email o contraseña incorrectos.';
        }
      );
    } else {
      this.errorMessage = 'Por favor, complete todos los campos correctamente.';
      this.form.markAllAsTouched();
    }
  }
}