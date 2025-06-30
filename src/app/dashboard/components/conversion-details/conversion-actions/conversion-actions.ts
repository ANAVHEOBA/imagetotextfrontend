import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-conversion-actions',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './conversion-actions.html',
  styleUrls: ['./conversion-actions.scss']
})
export class ConversionActionsComponent {
  @Input() isCompleted = false;
  @Output() copyText = new EventEmitter<void>();
  @Output() downloadText = new EventEmitter<void>();
  @Output() downloadWord = new EventEmitter<void>();
} 