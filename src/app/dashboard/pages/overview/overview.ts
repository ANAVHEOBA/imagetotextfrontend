import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ProfileApi } from '../../../../lib/profile/api';
import { Profile } from '../../../../lib/profile/types';
import { ProfileDisplayComponent } from './components/profile-display/profile-display';

@Component({
  selector: 'app-overview',
  standalone: true,
  imports: [CommonModule, ProfileDisplayComponent],
  templateUrl: './overview.html',
  styleUrls: ['./overview.scss']
})
export class OverviewComponent implements OnInit {
  profile: Profile | null = null;
  isLoading: boolean = true;
  error: string | null = null;

  constructor(private router: Router) {}

  ngOnInit() {
    this.loadProfile();
  }

  private async loadProfile() {
    try {
      // Get user ID from localStorage
      const userData = localStorage.getItem('user');
      if (!userData) {
        this.router.navigate(['/login']);
        return;
      }

      const user = JSON.parse(userData);
      this.profile = await ProfileApi.getProfile(user.uuid);
      this.isLoading = false;
    } catch (error) {
      this.error = error instanceof Error ? error.message : 'Failed to load profile';
      this.isLoading = false;
      
      // If unauthorized, redirect to login
      if (error instanceof Error && error.message.includes('401')) {
        this.router.navigate(['/login']);
      }
    }
  }
}
