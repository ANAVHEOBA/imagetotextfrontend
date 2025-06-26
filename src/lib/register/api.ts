import { environment } from '../../environments/environment';
import { RegisterRequest, RegisterResponse, VerifyEmailRequest, VerifyEmailResponse } from './types';

export class RegisterApi {
  private static readonly BASE_URL = `${environment.apiUrl}/api/auth/public`;

  static async register(data: RegisterRequest): Promise<RegisterResponse> {
    try {
      const response = await fetch(`${this.BASE_URL}/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Registration failed');
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Registration failed: ${error.message}`);
      }
      throw new Error('Registration failed: Unknown error');
    }
  }

  static async verifyEmail(userId: string, data: VerifyEmailRequest): Promise<VerifyEmailResponse> {
    try {
      const response = await fetch(`${this.BASE_URL}/verify/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Verification failed');
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Verification failed: ${error.message}`);
      }
      throw new Error('Verification failed: Unknown error');
    }
  }

  // Example usage:
  // try {
  //   // 1. Register
  //   const registerResult = await RegisterApi.register({
  //     email: 'user@example.com',
  //     password: 'password123',
  //     full_name: 'John Doe',
  //     account_type: 'Individual'
  //   });
  //   console.log('Registration successful:', registerResult);
  //
  //   // 2. Verify email
  //   const verifyResult = await RegisterApi.verifyEmail(registerResult.user.uuid, {
  //     code: '123456'
  //   });
  //   console.log('Verification successful:', verifyResult);
  // } catch (error) {
  //   console.error('Operation failed:', error);
  // }
} 