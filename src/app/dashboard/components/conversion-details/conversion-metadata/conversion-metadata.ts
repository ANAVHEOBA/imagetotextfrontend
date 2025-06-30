import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-conversion-metadata',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './conversion-metadata.html',
  styleUrls: ['./conversion-metadata.scss']
})
export class ConversionMetadataComponent {
  @Input() jobId: string | null = null;
  @Input() status: 'completed' | 'processing' | 'failed' = 'processing';
  @Input() originalFilename: string | null = null;
  @Input() createdAt: string | null = null;
  @Input() processingTimeMs: number | null = null;
} 