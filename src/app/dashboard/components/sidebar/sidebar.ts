import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

interface NavItem {
  label: string;
  route: string;
  icon: string;
}

@Component({
  selector: 'app-sidebar',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss'
})
export class Sidebar {
  navItems: NavItem[] = [
    { label: 'Overview', route: '/dashboard/overview', icon: 'dashboard' },
    { label: 'Convert', route: '/dashboard/convert', icon: 'image' },
    { label: 'Projects', route: '/dashboard/projects', icon: 'sync' },
    { label: 'History', route: '/dashboard/history', icon: 'history' },
    { label: 'Billing', route: '/dashboard/billing', icon: 'payment' },
    { label: 'Settings', route: '/dashboard/settings', icon: 'settings' }
  ];

  // Get the user data from localStorage
  user = JSON.parse(localStorage.getItem('user') || '{}');
}
