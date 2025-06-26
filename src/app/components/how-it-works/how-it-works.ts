import { Component } from '@angular/core';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-how-it-works',
  standalone: true,
  imports: [NgFor, NgIf],
  templateUrl: './how-it-works.html',
  styleUrls: ['./how-it-works.scss']
})
export class HowItWorksComponent {
  steps = [
    {
      number: 1,
      icon: '📤',
      title: 'Upload Your Image',
      description: 'Drag and drop your image or click to browse. We support PNG, JPG, and more.'
    },
    {
      number: 2,
      icon: '⚡',
      title: 'Instant Processing',
      description: 'Our advanced OCR technology processes your image in seconds.'
    },
    {
      number: 3,
      icon: '✨',
      title: 'Get Editable Text',
      description: 'Download your extracted text in various formats or copy directly to clipboard.'
    },
    {
      number: 4,
      icon: '📝',
      title: 'Edit & Format',
      description: 'Make any necessary adjustments to the extracted text with our built-in editor.'
    }
  ];
}
