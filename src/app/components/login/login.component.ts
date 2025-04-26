import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { LoginService } from './login.service';
import { AuthService } from '../../services/auth.service';

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

  constructor(
    private formBuilder: FormBuilder,
    private loginService: LoginService,
    private authService: AuthService,
    private router: Router
  ) {
    this.form = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(1)]],
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
          this.authService.storeTokens(access, refresh);
          this.router.navigate(['/dashboard']);
        },
        (error) => {
          this.errorMessage = 'Invalid email or password';
          console.error(error);
        }
      );
    } else {
      this.errorMessage = 'Please fill in all required fields correctly';
      this.form.markAllAsTouched();
    }
  }
}