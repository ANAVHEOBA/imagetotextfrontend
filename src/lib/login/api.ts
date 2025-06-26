import { environment } from '../../environments/environment';
import { LoginRequest, LoginResponse, RefreshTokenRequest, RefreshTokenResponse } from './types';

export class AuthApi {
  private static readonly BASE_URL = `${environment.apiUrl}/api/auth`;
  private static readonly PUBLIC_URL = `${this.BASE_URL}/public`;
  private static readonly PROTECTED_URL = `${this.BASE_URL}/protected`;

  static async login(request: LoginRequest): Promise<{ response: LoginResponse; refreshToken: string }> {
    try {
      // First make the login request without parsing the response
      const response = await fetch(`${this.PUBLIC_URL}/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Login failed with status ${response.status}`);
      }

      // Get the refresh token from the header
      const refreshToken = response.headers.get('x-refresh-token');

      // If we don't have a refresh token, make a separate request to get one
      if (!refreshToken) {
        // Get the response data first
        const responseData = await response.json();
        
        // Make a separate request to get a refresh token
        const refreshResponse = await fetch(`${this.PUBLIC_URL}/refresh-token`, {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${responseData.token}`,
            'Content-Type': 'application/json'
          },
          credentials: 'include'
        });

        if (!refreshResponse.ok) {
          throw new Error('Failed to obtain refresh token');
        }

        const refreshData = await refreshResponse.json();
        return {
          response: responseData,
          refreshToken: refreshData.refresh_token
        };
      }

      // If we have a refresh token from the header, return both
      const responseData = await response.json();
      return {
        response: responseData,
        refreshToken
      };
    } catch (error) {
      console.error('Login error:', error);
      throw error instanceof Error ? error : new Error('An unexpected error occurred during login');
    }
  }

  static async refreshToken(request: RefreshTokenRequest): Promise<RefreshTokenResponse> {
    try {
      const response = await fetch(`${this.PUBLIC_URL}/refresh-token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(request),
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Token refresh failed with status ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error('Token refresh error:', error);
      throw error instanceof Error ? error : new Error('An unexpected error occurred during token refresh');
    }
  }

  static async logout(userId: string): Promise<{ message: string; data: null }> {
    try {
      const response = await fetch(`${this.PROTECTED_URL}/logout/${userId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include'
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Logout failed with status ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error('Logout error:', error);
      throw error instanceof Error ? error : new Error('An unexpected error occurred during logout');
    }
  }
} 