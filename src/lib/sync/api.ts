import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../environments/environment';
import {
  CreateProjectPayload,
  Project,
  GetProjectsResponse,
  GetConversionsResponse,
  AssignConversionsPayload
} from './types';

@Injectable({
  providedIn: 'root',
})
export class SyncApi {
  private apiUrl = `${environment.apiUrl}/api/sync`;

  constructor(private http: HttpClient) {}

  createProject(payload: CreateProjectPayload): Observable<Project> {
    return this.http.post<Project>(`${this.apiUrl}/projects`, payload);
  }

  getProjects(page: number, limit: number): Observable<GetProjectsResponse> {
    return this.http.get<GetProjectsResponse>(`${this.apiUrl}/projects/${page}/${limit}`);
  }

  getProject(projectId: string): Observable<Project> {
    console.log('Making API request to:', `${this.apiUrl}/project/${projectId}`);
    // This is a workaround because there is no direct API endpoint to get a project by ID.
    // We fetch a large list of projects and find the one we need on the client-side.
    return this.http.get<GetProjectsResponse>(`${this.apiUrl}/projects/1/100`).pipe(
      map((response: GetProjectsResponse) => {
        const project = response.projects.find(p => p.id === projectId);
        if (!project) {
          throw new Error('Project not found');
        }
        return project;
      })
    );
  }

  getUnassignedConversions(page: number, limit: number): Observable<GetConversionsResponse> {
    return this.http.get<GetConversionsResponse>(`${this.apiUrl}/conversions/unassigned/${page}/${limit}`);
  }

  assignConversions(projectId: string, payload: AssignConversionsPayload): Observable<any> {
    return this.http.post(`${this.apiUrl}/projects/${projectId}/assign`, payload);
  }

  getProjectConversions(projectId: string, page: number, limit: number): Observable<GetConversionsResponse> {
    console.log('Making conversions API request to:', `${this.apiUrl}/projects/${projectId}/conversions/${page}/${limit}`);
    return this.http.get<GetConversionsResponse>(`${this.apiUrl}/projects/${projectId}/conversions/${page}/${limit}`);
  }
} 