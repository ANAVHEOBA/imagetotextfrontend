import { Component, OnDestroy } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthApi } from '../../../lib/login/api';
import { LoginRequest } from '../../../lib/login/types';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.scss']
})
export class LoginComponent implements OnDestroy {
  loginData: LoginRequest = {
    email: '',
    password: ''
  };
  errorMessage: string = '';
  isLoading: boolean = false;
  private refreshInterval?: number;

  constructor(private router: Router) {}

  ngOnDestroy() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
  }

  async onSubmit() {
    if (!this.loginData.email || !this.loginData.password) {
      this.errorMessage = 'Please enter both email and password';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    try {
      const { response, refreshToken } = await AuthApi.login(this.loginData);
      
      // Store tokens and user data
      localStorage.setItem('access_token', response.token);
      localStorage.setItem('refresh_token', refreshToken);
      localStorage.setItem('user', JSON.stringify(response.user));
      
      // Set up refresh token timer
      this.setupTokenRefresh();
      
      // Navigate to dashboard
      this.router.navigate(['/dashboard']);
    } catch (error) {
      console.error('Login error:', error);
      this.errorMessage = error instanceof Error 
        ? error.message 
        : 'An unexpected error occurred. Please try again.';
    } finally {
      this.isLoading = false;
    }
  }

  private setupTokenRefresh() {
    // Clear any existing interval
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }

    // Refresh token 5 minutes before expiry (assuming 1-hour expiry)
    const REFRESH_INTERVAL = (55 * 60 * 1000); // 55 minutes
    
    this.refreshInterval = window.setInterval(async () => {
      try {
        const currentRefreshToken = localStorage.getItem('refresh_token');
        if (!currentRefreshToken) {
          console.warn('No refresh token found during refresh attempt');
          this.handleLogout();
          return;
        }

        const refreshResponse = await AuthApi.refreshToken({ refresh_token: currentRefreshToken });
        
        // Update stored tokens
        localStorage.setItem('access_token', refreshResponse.access_token);
        localStorage.setItem('refresh_token', refreshResponse.refresh_token);
      } catch (error) {
        console.error('Token refresh failed:', error);
        this.handleLogout();
      }
    }, REFRESH_INTERVAL);
  }

  private handleLogout() {
    // Clear all auth data
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    localStorage.removeItem('user');
    
    // Clear refresh interval
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
    }
    
    // Redirect to login
    this.router.navigate(['/login']);
  }
}
