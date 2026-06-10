/**
 * File: sales-by-category.component.ts
 * Description: New component for the Sales by Category report. Displays a bar
 *   chart of total sales grouped by salesperson for a user-selected product
 *   category. Fetches available categories on component initialization, then
 *   fetches and renders sales data when the user submits the form.
 *
 * Changes (new file):
 * - Created SalesByCategoryComponent as a standalone Angular component.
 * - On construction, calls GET /reports/sales/categories to populate the
 *   category dropdown so users can select a category before submitting.
 * - onSubmit() calls GET /reports/sales/categories/:category and maps the
 *   response into separate totalSales and salesPeople arrays for the chart.
 */

import { HttpClient } from '@angular/common/http';
import { Component, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ChartComponent } from '../../../shared/chart/chart.component';

@Component({
  selector: 'app-sales-by-category',
  standalone: true,
  imports: [ReactiveFormsModule, ChartComponent],
  template: `
    <h1>Sales by Category</h1>
    <div class="category-container">
      <form class="form" [formGroup]="categoryForm" (ngSubmit)="onSubmit()">
        <div class="form__group">
          <label class="label" for="category">Category</label>
          <select
            class="select"
            formControlName="category"
            id="category"
            name="category"
          >
            @for (category of categories; track category) {
              <option value="{{ category }}">{{ category }}</option>
            }
          </select>
        </div>
        <div class="form__actions">
          <button class="button button--primary" type="submit">Submit</button>
        </div>
      </form>

      @if (totalSales.length && salesPeople.length) {
        <div class="card chart-card">
          <app-chart
            [type]="'bar'"
            [label]="'Sales by Category'"
            [data]="totalSales"
            [labels]="salesPeople"
          >
          </app-chart>
        </div>
      }
    </div>
  `,
  styles: [
    `
      .category-container {
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
export class SalesByCategoryComponent implements AfterViewInit {
  totalSales: number[] = [];
  salesPeople: string[] = [];
  categories: string[] = [];

  categoryForm = this.fb.group({
    category: [null, Validators.compose([Validators.required])],
  });

  constructor(
    private http: HttpClient,
    private fb: FormBuilder,
    private cdr: ChangeDetectorRef,
  ) {
    // Fetch distinct categories on init so the dropdown is populated before the user interacts
    this.http
      .get(`${environment.apiBaseUrl}/reports/sales/categories`)
      .subscribe({
        next: (data: any) => {
          this.categories = data;
        },
        error: (err) => {
          console.error('Error fetching categories:', err);
        },
      });
  }

  ngAfterViewInit(): void {}

  onSubmit() {
    const category = this.categoryForm.controls['category'].value;

    // Fetch sales records for the selected category; map to parallel arrays for the bar chart
    this.http
      .get(`${environment.apiBaseUrl}/reports/sales/categories/${category}`)
      .subscribe({
        next: (data: any) => {
          this.totalSales = data.map((record: any) => record.totalSales);
          this.salesPeople = data.map((record: any) => record.salesperson);
          // Manually trigger change detection because the chart renders outside Angular's default cycle
          this.cdr.markForCheck();
          this.cdr.detectChanges();
        },
        error: (err) => {
          console.error('Error fetching sales data by category:', err);
        },
      });
  }
}
