export interface CreateProjectPayload {
  name: string;
  description: string;
}

export interface Project {
  id: string;
  name: string;
  description: string;
  cloudinary_folder: string;
  conversion_count: number;
  total_storage_bytes: number;
  created_at: string;
  updated_at: string;
}

export interface GetProjectsResponse {
  projects: Project[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}

export interface Conversion {
  job_id: string;
  original_filename: string;
  cloudinary_url: string;
  file_size: number;
  status: 'completed' | 'processing' | 'failed';
  created_at: string;
  completed_at?: string;
}

export interface GetConversionsResponse {
  conversions: Conversion[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
} 