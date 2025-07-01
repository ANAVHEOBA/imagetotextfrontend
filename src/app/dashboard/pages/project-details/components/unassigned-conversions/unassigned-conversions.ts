import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { SyncApi } from '../../../../../../lib/sync/api';
import { Conversion, GetConversionsResponse } from '../../../../../../lib/sync/types';
import { ParseDatePipe } from '../../../../../../app/pipes/parse-date.pipe';

@Component({
  selector: 'app-unassigned-conversions',
  standalone: true,
  imports: [CommonModule, FormsModule, ParseDatePipe],
  templateUrl: './unassigned-conversions.html',
  styleUrls: ['./unassigned-conversions.scss']
})
export class UnassignedConversionsComponent implements OnInit {
  @Output() close = new EventEmitter<void>();
  @Output() conversionsSelected = new EventEmitter<string[]>();

  conversions: Conversion[] = [];
  selectedConversionIds: { [key: string]: boolean } = {};
  isLoading = true;
  error: string | null = null;

  constructor(private syncApi: SyncApi) {}

  ngOnInit(): void {
    this.fetchUnassignedConversions();
  }

  fetchUnassignedConversions(): void {
    this.isLoading = true;
    this.syncApi.getUnassignedConversions(1, 100).subscribe({ // Fetch up to 100
      next: (response: GetConversionsResponse) => {
        this.conversions = response.conversions;
        this.isLoading = false;
      },
      error: (err: any) => {
        this.error = 'Failed to load unassigned conversions.';
        this.isLoading = false;
        console.error(err);
      }
    });
  }

  onAssignClick(): void {
    const selectedIds = Object.keys(this.selectedConversionIds).filter(id => this.selectedConversionIds[id]);
    if (selectedIds.length > 0) {
      this.conversionsSelected.emit(selectedIds);
    }
  }
} 