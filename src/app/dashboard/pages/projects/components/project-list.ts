import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterModule } from '@angular/router';
import { SyncApi } from '../../../../../lib/sync/api';
import { Project } from '../../../../../lib/sync/types';

@Component({
  selector: 'app-project-list',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterModule],
  templateUrl: './project-list.html',
  styleUrls: ['./project-list.scss']
})
export class ProjectListComponent implements OnInit {
  projects: Project[] = [];
  isLoading = true;
  error: string | null = null;

  currentPage = 1;
  totalPages = 1;
  limit = 5;

  constructor(private syncApi: SyncApi) {}

  ngOnInit(): void {
    this.fetchProjects();
  }

  fetchProjects(): void {
    this.isLoading = true;
    this.syncApi.getProjects(this.currentPage, this.limit).subscribe({
      next: (response) => {
        this.projects = response.projects;
        this.totalPages = response.total_pages;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = 'Failed to load projects. Please try again later.';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  goToNextPage(): void {
    if (this.currentPage < this.totalPages) {
      this.currentPage++;
      this.fetchProjects();
    }
  }

  goToPreviousPage(): void {
    if (this.currentPage > 1) {
      this.currentPage--;
      this.fetchProjects();
    }
  }
} 