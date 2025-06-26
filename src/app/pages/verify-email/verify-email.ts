import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { RegisterApi } from '../../../lib/register/api';

@Component({
  selector: 'app-verify-email',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './verify-email.html',
  styleUrls: ['./verify-email.scss']
})
export class VerifyEmailComponent implements OnInit, OnDestroy {
  verifyForm: FormGroup;
  loading = false;
  error = '';
  success = false;
  userId: string = '';
  countdown = 60;
  private countdownInterval: any;

  constructor(
    private formBuilder: FormBuilder,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.verifyForm = this.formBuilder.group({
      code: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]]
    });
  }

  ngOnInit() {
    this.userId = this.route.snapshot.params['userId'];
    this.startCountdown();
  }

  ngOnDestroy() {
    if (this.countdownInterval) {
      clearInterval(this.countdownInterval);
    }
  }

  private startCountdown() {
    this.countdownInterval = setInterval(() => {
      if (this.countdown > 0) {
        this.countdown--;
      } else {
        clearInterval(this.countdownInterval);
      }
    }, 1000);
  }

  async onSubmit() {
    if (this.verifyForm.invalid) {
      return;
    }

    this.loading = true;
    this.error = '';

    try {
      const response = await RegisterApi.verifyEmail(this.userId, {
        code: this.verifyForm.get('code')?.value
      });
      
      this.success = true;
      setTimeout(() => {
        this.router.navigate(['/login']);
      }, 3000);
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'Verification failed';
    } finally {
      this.loading = false;
    }
  }
}
