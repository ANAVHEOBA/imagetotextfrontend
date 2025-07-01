import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SyncApi } from '../../../../lib/sync/api';
import { Project, Conversion, GetConversionsResponse } from '../../../../lib/sync/types';

@Component({
  selector: 'app-project-details',
  standalone: true,
  imports: [CommonModule, RouterLink],
  templateUrl: './project-details.html',
  styleUrls: ['./project-details.scss']
})
export class ProjectDetailsPage implements OnInit {
  project: Project | null = null;
  conversions: Conversion[] = [];
  isLoading = true;
  error: string | null = null;
  currentProjectId: string | null = null;

  constructor(
    public route: ActivatedRoute,
    private syncApi: SyncApi
  ) {}

  ngOnInit(): void {
    const projectId = this.route.snapshot.paramMap.get('id');
    console.log('Project ID from route:', projectId);
    
    if (!projectId) {
      this.error = 'Project ID is missing';
      this.isLoading = false;
      return;
    }

    this.currentProjectId = projectId;
    this.loadProjectDetails(projectId);
  }

  public loadProjectDetails(projectId: string): void {
    console.log('Fetching project details for ID:', projectId);
    this.error = null;
    this.isLoading = true;
    
    this.syncApi.getProject(projectId).subscribe({
      next: (project: Project) => {
        console.log('Project details received:', project);
        this.project = project;
        this.fetchConversions(projectId);
      },
      error: (err: any) => {
        console.error('Error fetching project details:', err);
        if (err.message === 'Project not found') {
          this.error = `Project with ID ${projectId} was not found.`;
        } else {
          this.error = 'Failed to load project details. Please try again later.';
        }
        this.isLoading = false;
      }
    });
  }

  private fetchConversions(projectId: string): void {
    console.log('Fetching conversions for project:', projectId);
    
    this.syncApi.getProjectConversions(projectId, 1, 10).subscribe({
      next: (response: GetConversionsResponse) => {
        console.log('Conversions received:', response);
        this.conversions = response.conversions;
        this.isLoading = false;
      },
      error: (err: any) => {
        console.error('Error fetching conversions:', err);
        // Don't show conversion errors if we already have the project details
        if (!this.error) {
          this.error = 'Failed to load conversions. ' + (err.error?.message || err.message || '');
        }
        this.isLoading = false;
      }
    });
  }
}