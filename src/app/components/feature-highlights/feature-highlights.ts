import { Component } from '@angular/core';
import { NgFor } from '@angular/common';

@Component({
  selector: 'app-feature-highlights',
  standalone: true,
  imports: [NgFor],
  templateUrl: './feature-highlights.html',
  styleUrls: ['./feature-highlights.scss']
})
export class FeatureHighlightsComponent {
  features = [
    {
      icon: '🎯',
      title: 'High Accuracy',
      description: 'Advanced OCR technology ensures precise text extraction from your images.'
    },
    {
      icon: '⚡',
      title: 'Instant Results',
      description: 'Get your text within seconds, no matter the image size or complexity.'
    },
    {
      icon: '📱',
      title: 'Multiple Formats',
      description: 'Support for various image formats including PNG, JPG, TIFF, and screenshots.'
    },
    {
      icon: '🔒',
      title: 'Secure Processing',
      description: 'Your images are processed securely and deleted immediately after conversion.'
    }
  ];
}
