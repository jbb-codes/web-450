/**
 * Author: Jarren Bess
 * Date: 6/24/2026
 * File: feedback-by-channel.component.ts
 * Description: Displays a sortable table of customer feedback counts and average ratings grouped by support channel
 *
 * Purpose:
 * Gives stakeholders an at-a-glance comparison of all support channels — volume
 * and average rating — in a single view, without requiring a filter selection.
 *
 * Implementation decisions:
 * - Data loads automatically on init rather than on form submit because the report's
 *   value comes from seeing all channels side by side; a filter would obscure that.
 */
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../environments/environment';
import { TableComponent } from '../../../shared/table/table.component';

interface FeedbackByChannel {
  channel: string;
  feedbackCount: number;
  ratingAvg: number;
}

// Keys must exactly match tableHeaders so TableComponent can look up each cell value.
interface FeedbackTableRow {
  Channel: string;
  'Feedback Count': number;
  'Avg Rating': number;
}

@Component({
  selector: 'app-feedback-by-channel',
  standalone: true,
  imports: [CommonModule, TableComponent],
  template: `
    <h1 data-testid="page-title">Customer Feedback by Channel</h1>

    @if (errorMessage) {
      <div class="message message--error">{{ errorMessage }}</div>
    }

    @if (tableData.length) {
      <div data-testid="feedback-table">
        <app-table
          [title]="'Feedback Summary by Channel'"
          [data]="tableData"
          [headers]="tableHeaders"
          [sortableColumns]="tableHeaders"
          [headerBackground]="'primary'"
        >
        </app-table>
      </div>
    }
  `,
  styles: `
    h1 {
      text-align: center;
    }
  `,
})
export class FeedbackByChannelComponent implements OnInit {
  tableData: FeedbackTableRow[] = [];
  tableHeaders: string[] = ['Channel', 'Feedback Count', 'Avg Rating'];
  errorMessage: string = '';

  constructor(private http: HttpClient) {}

  ngOnInit() {
    this.http
      .get<
        FeedbackByChannel[]
      >(`${environment.apiBaseUrl}/reports/customer-feedback/feedback-by-channel`)
      .subscribe({
        next: (data) => {
          this.tableData = data.map((item) => ({
            Channel: item.channel,
            'Feedback Count': item.feedbackCount,
            'Avg Rating': item.ratingAvg,
          }));
        },
        error: (err) => {
          console.error('Error fetching feedback by channel:', err);
          this.errorMessage = 'An error occurred while loading the report.';
        },
      });
  }
}
