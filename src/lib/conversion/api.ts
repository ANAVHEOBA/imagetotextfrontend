import { environment } from '../../environments/environment';
import { ConversionUploadResponse, ConversionJobStatus, ConversionHistoryItem, PreviewResponse, DownloadFormat } from './types';

export class ConversionApi {
  private static readonly BASE_URL = `${environment.apiUrl}/api/conversion`;
  private static readonly EDITOR_URL = `${environment.apiUrl}/api/editor`;

  static async uploadImage(file: File): Promise<ConversionUploadResponse> {
    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await fetch(`${this.BASE_URL}/upload`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        },
        body: formData
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Upload failed with status ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error('Upload error:', error);
      throw error instanceof Error ? error : new Error('An unexpected error occurred during upload');
    }
  }

  static async getJobStatus(jobId: string): Promise<ConversionJobStatus> {
    try {
      const response = await fetch(`${this.BASE_URL}/${jobId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Status check failed with status ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error('Status check error:', error);
      throw error instanceof Error ? error : new Error('An unexpected error occurred during status check');
    }
  }

  static async getConversionHistory(page: number = 1, limit: number = 10): Promise<{
    items: ConversionHistoryItem[];
    total: number;
    page: number;
    limit: number;
  }> {
    try {
      const response = await fetch(`${this.BASE_URL}/history?page=${page}&limit=${limit}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `History fetch failed with status ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error('History fetch error:', error);
      throw error instanceof Error ? error : new Error('An unexpected error occurred while fetching history');
    }
  }

  static async deleteConversion(jobId: string): Promise<{ message: string }> {
    try {
      const response = await fetch(`${this.BASE_URL}/${jobId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Delete failed with status ${response.status}`);
      }

      return response.json();
    } catch (error) {
      console.error('Delete error:', error);
      throw error instanceof Error ? error : new Error('An unexpected error occurred during deletion');
    }
  }

  static async downloadText(jobId: string): Promise<Blob> {
    return this.downloadFile(jobId, DownloadFormat.TEXT);
  }

  static async downloadWord(jobId: string): Promise<Blob> {
    return this.downloadFile(jobId, DownloadFormat.WORD);
  }

  static async downloadPdf(jobId: string): Promise<Blob> {
    return this.downloadFile(jobId, DownloadFormat.PDF);
  }

  private static async downloadFile(jobId: string, format: DownloadFormat): Promise<Blob> {
    try {
      const response = await fetch(`${this.BASE_URL}/${jobId}/download/${format}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Download failed with status ${response.status}`);
      }

      return response.blob();
    } catch (error) {
      console.error('Download error:', error);
      throw error instanceof Error ? error : new Error('An unexpected error occurred during download');
    }
  }

  static async getPreview(conversionId: string): Promise<PreviewResponse> {
    try {
      const response = await fetch(`${this.EDITOR_URL}/preview/${conversionId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('access_token')}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `Preview fetch failed with status ${response.status}`);
      }

      const data = await response.json();
      
      // Convert the last_modified timestamp to a Date object
      if (data.metadata?.last_modified?.$date?.$numberLong) {
        data.metadata.last_modified = new Date(parseInt(data.metadata.last_modified.$date.$numberLong));
      }
      
      return data;
    } catch (error) {
      console.error('Preview fetch error:', error);
      throw error instanceof Error ? error : new Error('An unexpected error occurred while fetching preview');
    }
  }
} 