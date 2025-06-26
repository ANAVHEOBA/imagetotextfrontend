import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './footer.html',
  styleUrls: ['./footer.scss']
})
export class FooterComponent {
  currentYear = new Date().getFullYear();

  footerLinks = {
    product: [
      { text: 'Features', path: '/features' },
      { text: 'Pricing', path: '/pricing' },
      { text: 'Use Cases', path: '/use-cases' },
      { text: 'Support', path: '/support' }
    ],
    company: [
      { text: 'About Us', path: '/about' },
      { text: 'Blog', path: '/blog' },
      { text: 'Careers', path: '/careers' },
      { text: 'Contact', path: '/contact' }
    ],
    legal: [
      { text: 'Privacy Policy', path: '/privacy' },
      { text: 'Terms of Service', path: '/terms' },
      { text: 'Cookie Policy', path: '/cookies' }
    ],
    social: [
      { text: 'Twitter', url: 'https://twitter.com' },
      { text: 'LinkedIn', url: 'https://linkedin.com' },
      { text: 'GitHub', url: 'https://github.com' }
    ]
  };

  // Footer data
  links = [
    { text: 'About', url: '/about' },
    { text: 'Contact', url: '/contact' },
    { text: 'Privacy', url: '/privacy' },
    { text: 'Terms', url: '/terms' }
  ];

  resources = [
    { text: 'Documentation', url: '/docs' },
    { text: 'API', url: '/api' },
    { text: 'Support', url: '/support' }
  ];
} 