import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RegisterApi } from '../../../lib/register/api';
import { AccountType } from '../../../lib/register/types';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.html',
  styleUrls: ['./register.scss']
})
export class RegisterComponent {
  registerForm: FormGroup;
  loading = false;
  error = '';
  showPassword = false;
  accountTypes: AccountType[] = ['Individual', 'Student', 'Business', 'Enterprise'];

  constructor(
    private formBuilder: FormBuilder,
    private router: Router
  ) {
    this.registerForm = this.formBuilder.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      full_name: ['', Validators.required],
      account_type: ['Individual', Validators.required]
    });
  }

  togglePasswordVisibility() {
    this.showPassword = !this.showPassword;
  }

  async onSubmit() {
    if (this.registerForm.invalid) {
      return;
    }

    this.loading = true;
    this.error = '';

    try {
      const response = await RegisterApi.register(this.registerForm.value);
      // Redirect to verification page with the user ID
      this.router.navigate(['/verify', response.user.uuid]);
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'Registration failed';
    } finally {
      this.loading = false;
    }
  }
}
