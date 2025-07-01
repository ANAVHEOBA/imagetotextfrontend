import { Component, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProjectListComponent } from './components/project-list';
import { CreateProjectFormComponent } from './components/create-project-form/create-project-form';

@Component({
  selector: 'app-projects',
  standalone: true,
  imports: [CommonModule, ProjectListComponent, CreateProjectFormComponent],
  templateUrl: './projects.html',
  styleUrls: ['./projects.scss']
})
export class ProjectsPage {
  @ViewChild(ProjectListComponent) projectListComponent!: ProjectListComponent;

  isCreateModalVisible = false;

  handleProjectCreated() {
    this.isCreateModalVisible = false;
    this.projectListComponent.ngOnInit();
  }
} 