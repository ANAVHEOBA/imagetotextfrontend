import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { SyncApi } from '../../../../lib/sync/api';
import { Project, Conversion, GetConversionsResponse } from '../../../../lib/sync/types';
import { UnassignedConversionsComponent } from './components/unassigned-conversions/unassigned-conversions';
import { ParseDatePipe } from '../../../pipes/parse-date.pipe';

@Component({
  selector: 'app-project-details',
  standalone: true,
  imports: [CommonModule, RouterLink, UnassignedConversionsComponent, ParseDatePipe],
  templateUrl: './project-details.html',
  styleUrls: ['./project-details.scss']
})
export class ProjectDetailsPage implements OnInit {
  /**
   * Provides parameters for prerendering.
   * Since project details are dynamic and user-specific, we return an empty array
   * to tell the build process to skip prerendering for this route.
   */
  static getPrerenderParams() {
    return [];
  }

  project: Project | null = null;
  conversions: Conversion[] = [];
  isLoading = true;
  error: string | null = null;
  currentProjectId: string | null = null;
  isAssignModalVisible = false;

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

  handleConversionsAssigned(conversionIds: string[]): void {
    if (!this.currentProjectId) {
      this.error = 'Cannot assign conversions without a project ID.';
      return;
    }

    const payload = { conversion_ids: conversionIds };
    this.syncApi.assignConversions(this.currentProjectId, payload).subscribe({
      next: () => {
        this.isAssignModalVisible = false;
        // Refresh project data to show updated counts and lists
        if (this.currentProjectId) {
          this.loadProjectDetails(this.currentProjectId);
        }
      },
      error: (err) => {
        console.error('Failed to assign conversions', err);
        // You could add an error message to the modal here
      }
    });
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