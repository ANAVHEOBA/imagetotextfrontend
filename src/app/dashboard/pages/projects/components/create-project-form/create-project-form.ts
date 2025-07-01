import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormBuilder, Validators, FormGroup } from '@angular/forms';
import { SyncApi } from '../../../../../../lib/sync/api';
import { Project } from '../../../../../../lib/sync/types';

@Component({
  selector: 'app-create-project-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './create-project-form.html',
  styleUrls: ['./create-project-form.scss']
})
export class CreateProjectFormComponent {
  @Output() close = new EventEmitter<void>();
  @Output() projectCreated = new EventEmitter<Project>();

  projectForm: FormGroup;
  isLoading = false;
  error: string | null = null;

  constructor(private fb: FormBuilder, private syncApi: SyncApi) {
    this.projectForm = this.fb.group({
      name: ['', Validators.required],
      description: ['']
    });
  }

  onSubmit(): void {
    if (this.projectForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.error = null;

    this.syncApi.createProject(this.projectForm.value).subscribe({
      next: (newProject: Project) => {
        this.isLoading = false;
        this.projectCreated.emit(newProject);
      },
      error: (err: any) => {
        this.isLoading = false;
        this.error = 'Failed to create project. Please try again.';
        console.error(err);
      }
    });
  }
} 