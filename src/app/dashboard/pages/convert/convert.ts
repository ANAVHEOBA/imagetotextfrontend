import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ConversionApi } from '../../../../lib/conversion/api';
import { ConversionResultComponent } from '../../components/conversion-details/conversion-result/conversion-result';
import { ConversionMetadataComponent } from '../../components/conversion-details/conversion-metadata/conversion-metadata';
import { ConversionActionsComponent } from '../../components/conversion-details/conversion-actions/conversion-actions';
import { PreviewResponse } from '../../../../lib/conversion/types';

@Component({
  selector: 'app-convert',
  standalone: true,
  imports: [
    CommonModule, 
    FormsModule,
    ConversionResultComponent,
    ConversionMetadataComponent,
    ConversionActionsComponent
  ],
  templateUrl: './convert.html',
  styleUrls: ['./convert.scss']
})
export class ConvertComponent {
  selectedFile: File | null = null;
  isUploading = false;
  uploadProgress = 0;
  conversionResult: string | null = null;
  error: string | null = null;
  jobId: string | null = null;
  status: 'completed' | 'processing' | 'failed' = 'processing';
  createdAt: string | null = null;
  processingTimeMs: number | null = null;
  pollingInterval: any = null;
  preview: PreviewResponse | null = null;

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      this.error = null;
      this.conversionResult = null;
      this.preview = null;
    }
  }

  async onUpload(): Promise<void> {
    if (!this.selectedFile) {
      this.error = 'Please select a file first';
      return;
    }

    this.isUploading = true;
    this.error = null;
    this.conversionResult = null;
    this.preview = null;
    this.uploadProgress = 0;

    try {
      const response = await ConversionApi.uploadImage(this.selectedFile);
      this.jobId = response.job_id;
      
      if (response.status === 'completed' && response.text) {
        this.conversionResult = response.text;
        await this.fetchPreview();
      } else {
        this.startPolling();
      }
      
      this.uploadProgress = 100;
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'An error occurred during upload';
    } finally {
      this.isUploading = false;
    }
  }

  private async fetchPreview(): Promise<void> {
    if (!this.jobId) return;

    try {
      this.preview = await ConversionApi.getPreview(this.jobId);
    } catch (err) {
      console.error('Failed to fetch preview:', err);
      // Don't set error here as we still have the extracted text
    }
  }

  private startPolling(): void {
    if (!this.jobId) return;

    this.pollingInterval = setInterval(async () => {
      try {
        const status = await ConversionApi.getJobStatus(this.jobId!);
        this.status = status.status;
        this.createdAt = status.created_at;
        this.processingTimeMs = status.processing_time_ms || null;
        
        if (status.status === 'completed') {
          this.conversionResult = status.extracted_text || 'No text extracted';
          await this.fetchPreview();
          this.stopPolling();
        } else if (status.status === 'failed') {
          this.error = status.error || 'Conversion failed';
          this.stopPolling();
        }
      } catch (err) {
        this.error = err instanceof Error ? err.message : 'Failed to check conversion status';
        this.stopPolling();
      }
    }, 2000); // Poll every 2 seconds
  }

  private stopPolling(): void {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
  }

  async copyText(): Promise<void> {
    if (this.conversionResult) {
      try {
        await navigator.clipboard.writeText(this.conversionResult);
        // Could add a toast notification here
      } catch (err) {
        this.error = 'Failed to copy text to clipboard';
      }
    }
  }

  async downloadText(): Promise<void> {
    if (!this.jobId) return;

    try {
      const blob = await ConversionApi.downloadText(this.jobId);
      this.downloadFile(blob, 'converted-text.txt');
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'Failed to download text';
    }
  }

  async downloadWord(): Promise<void> {
    if (!this.jobId) return;

    try {
      const blob = await ConversionApi.downloadWord(this.jobId);
      this.downloadFile(blob, `${this.selectedFile?.name.split('.')[0] || 'converted'}.docx`);
    } catch (err) {
      this.error = err instanceof Error ? err.message : 'Failed to download Word document';
    }
  }

  private downloadFile(blob: Blob, filename: string): void {
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
    document.body.removeChild(a);
  }

  clearFile(): void {
    this.selectedFile = null;
    this.conversionResult = null;
    this.error = null;
    this.jobId = null;
    this.preview = null;
    this.stopPolling();
  }

  ngOnDestroy(): void {
    this.stopPolling();
  }
}
