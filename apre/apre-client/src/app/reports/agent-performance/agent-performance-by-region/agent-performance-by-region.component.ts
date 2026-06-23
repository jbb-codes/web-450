/**
 * File: agent-performance-by-region.component.ts
 * Description: Agent Performance by Region report component. Displays a bar chart
 *   of average call duration per agent for a user-selected region.
 */
import { Component, ChangeDetectorRef } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ChartComponent } from '../../../shared/chart/chart.component';
import { environment } from '../../../../environments/environment';

@Component({
  selector: 'app-agent-performance-by-region',
  standalone: true,
  imports: [ReactiveFormsModule, ChartComponent],
  template: `
    <h1 data-testid="page-title">Agent Performance by Region</h1>
    <div class="region-container">
      <form class="form" [formGroup]="regionForm" (ngSubmit)="onSubmit()">
        <div class="form__group">
          <label class="label" for="region">Region</label>
          <select
            class="select"
            formControlName="region"
            id="region"
            name="region"
          >
            @for (region of regions; track region) {
              <option value="{{ region }}">{{ region }}</option>
            }
          </select>
        </div>
        <div class="form__actions">
          <button
            class="button button--primary"
            type="submit"
            [disabled]="regionForm.invalid"
          >
            Submit
          </button>
        </div>
      </form>

      @if (agents.length && agentData.length) {
        <div class="card chart-card">
          <app-chart
            [type]="'bar'"
            [label]="'Avg Call Duration (seconds)'"
            [data]="agentData"
            [labels]="agents"
          ></app-chart>
        </div>
      }
    </div>
  `,
  styles: [
    `
      .region-container {
        display: flex;
        flex-direction: column;
        align-items: center;
      }
      .form,
      .chart-card {
        width: 50%;
        margin: 20px 0;
      }
    `,
  ],
})
export class AgentPerformanceByRegionComponent {
  agents: string[] = []; // Agent names used as chart labels
  agentData: number[] = []; // Average call durations used as chart data
  regions: string[] = []; // Available regions populated from the API

  regionForm = this.fb.group({
    region: [null, Validators.required],
  });

  // Fetches the list of distinct regions from the API on component initialization
  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
  ) {
    this.http
      .get(`${environment.apiBaseUrl}/reports/agent-performance/regions`)
      .subscribe({
        next: (data: unknown) => {
          this.regions = data as string[];
        },
        error: (err: unknown) => {
          console.error('Error fetching regions:', err);
        },
      });
  }

  // Fetches per-agent average call duration for the selected region and updates chart data
  onSubmit(): void {
    if (this.regionForm.invalid) return;

    const region = this.regionForm.controls['region'].value;
    this.http
      .get(
        `${environment.apiBaseUrl}/reports/agent-performance/regions/${region}`,
      )
      .subscribe({
        next: (data: unknown) => {
          const rows = data as { agent: string; averageCallDuration: number }[];
          this.agents = rows.map((row) => row.agent);
          this.agentData = rows.map((row) => row.averageCallDuration);
          this.cdr.markForCheck();
          this.cdr.detectChanges();
        },
        error: (err: unknown) => {
          console.error('Error fetching agent performance by region:', err);
        },
      });
  }
}
