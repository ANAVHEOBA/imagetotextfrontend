import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Profile } from '../../../../../../lib/profile/types';

@Component({
  selector: 'app-profile-display',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile-display.html',
  styleUrls: ['./profile-display.scss']
})
export class ProfileDisplayComponent {
  @Input() profile!: Profile;
  @Input() isLoading: boolean = false;
  @Input() error: string | null = null;

  get accountCreatedDate(): Date {
    return new Date(this.profile?.created_at);
  }
}
