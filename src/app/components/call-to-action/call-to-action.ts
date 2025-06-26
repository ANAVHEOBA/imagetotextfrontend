import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-call-to-action',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './call-to-action.html',
  styleUrls: ['./call-to-action.scss']
})
export class CallToActionComponent {
  features = [
    {
      title: 'Free Trial',
      description: 'Try our service free for 14 days'
    },
    {
      title: 'No Credit Card',
      description: 'No credit card required to start'
    },
    {
      title: 'Cancel Anytime',
      description: 'No long-term commitments'
    }
  ];
}
