import { environment } from '../../environments/environment';
import { Profile } from './types';

export class ProfileApi {
  private static readonly BASE_URL = `${environment.apiUrl}/api/auth/protected/verified/profile`;

  static async getProfile(userId: string): Promise<Profile> {
    try {
      const response = await fetch(`${this.BASE_URL}/${userId}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json'
          // Note: Authorization header will be added by the interceptor
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to fetch profile');
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Profile fetch failed: ${error.message}`);
      }
      throw new Error('Profile fetch failed: Unknown error');
    }
  }

  static async updateProfile(userId: string, data: Partial<Profile>): Promise<Profile> {
    try {
      const response = await fetch(`${this.BASE_URL}/${userId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json'
          // Note: Authorization header will be added by the interceptor
        },
        body: JSON.stringify(data)
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update profile');
      }

      return await response.json();
    } catch (error) {
      if (error instanceof Error) {
        throw new Error(`Profile update failed: ${error.message}`);
      }
      throw new Error('Profile update failed: Unknown error');
    }
  }

  // Example usage:
  // try {
  //   // Get profile
  //   const profile = await ProfileApi.getProfile('user-uuid');
  //   console.log('Profile:', profile);
  //
  //   // Update profile
  //   const updatedProfile = await ProfileApi.updateProfile('user-uuid', {
  //     full_name: 'New Name'
  //   });
  //   console.log('Updated profile:', updatedProfile);
  // } catch (error) {
  //   console.error('Operation failed:', error);
  // }
} 