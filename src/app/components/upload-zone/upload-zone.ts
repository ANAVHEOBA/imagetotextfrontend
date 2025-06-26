import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-upload-zone',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './upload-zone.html',
  styleUrls: ['./upload-zone.scss']
})
export class UploadZoneComponent {
  selectedFile: File | null = null;
  isDragging = false;

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = true;
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging = false;

    const files = event.dataTransfer?.files;
    if (files && files.length > 0) {
      this.handleFile(files[0]);
    }
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.handleFile(input.files[0]);
    }
  }

  private handleFile(file: File) {
    if (this.isValidImageFile(file)) {
      this.selectedFile = file;
    } else {
      // Handle invalid file type
      alert('Please select a valid image file (JPG, PNG, GIF, BMP)');
    }
  }

  private isValidImageFile(file: File): boolean {
    const validTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/bmp'];
    return validTypes.includes(file.type);
  }

  clearFile() {
    this.selectedFile = null;
  }

  onUpload() {
    if (this.selectedFile) {
      // Implement upload logic here
      console.log('Uploading file:', this.selectedFile);
    }
  }
}
