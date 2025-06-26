import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-hero-section',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './hero-section.html',
  styleUrls: ['./hero-section.scss']
})
export class HeroSectionComponent {
  demoImages = [
    '/1000534324.jpg',
    '/1000534332.jpg'
  ];
}
