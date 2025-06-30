export interface ConversionUploadRequest {
  file: File;
}

export enum DownloadFormat {
  TEXT = 'text',
  WORD = 'word',
  PDF = 'pdf'
}

export interface ConversionUploadResponse {
  job_id: string;
  message: string;
  status: 'completed' | 'processing' | 'failed';
  text?: string;
  error?: string;
}

export interface ConversionJobStatus {
  job_id: string;
  status: 'completed' | 'processing' | 'failed';
  original_filename: string;
  extracted_text?: string;
  error?: string;
  created_at: string;
  processing_time_ms?: number;
}

export interface ConversionHistoryItem {
  job_id: string;
  original_filename: string;
  status: 'completed' | 'processing' | 'failed';
  created_at: string;
  completed_at?: string;
  extracted_text?: string;
  error?: string;
  processing_time_ms?: number;
}

export interface PreviewMetadata {
  total_pages: number;
  word_count: number;
  last_modified: Date;
  format: string;
}

export interface PreviewResponse {
  html_content: string;
  metadata: PreviewMetadata;
  conversion_id: string;
  status: 'ready' | 'processing' | 'failed';
} 