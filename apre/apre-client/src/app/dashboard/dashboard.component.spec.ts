/**
 * File: dashboard.component.spec.ts
 * Description: Unit tests for the DashboardComponent. Tests verify that the
 *   component renders correctly, calls the expected load methods on initialization,
 *   and that each of the five loading flags initializes to true, is set to false
 *   on HTTP success, and is set to false on HTTP error so spinners never hang.
 * - Tests 9–13: confirm each loading flag is cleared to false after a successful
 *   HTTP response so the chart or table renders in place of the spinner.
 * - Tests 14–18: confirm each loading flag is cleared to false when the HTTP
 *   request fails so the spinner does not hang indefinitely.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { DashboardComponent } from './dashboard.component';
import { environment } from '../../environments/environment';

describe('DashboardComponent', () => {
  let component: DashboardComponent;
  let fixture: ComponentFixture<DashboardComponent>;
  let httpTestingController: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        DashboardComponent,
        HttpClientTestingModule, // Add HttpClientModule to the imports array
      ],
    }).compileComponents();

    httpTestingController = TestBed.inject(HttpTestingController);

    fixture = TestBed.createComponent(DashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  // Test 1: loadReports should be called during ngOnInit
  it('should call loadReports on initialization', () => {
    spyOn(component, 'loadReports');
    component.ngOnInit();
    expect(component.loadReports).toHaveBeenCalled();
  });

  // Test 2: loadReports should delegate to loadSalesData
  it('should call loadSalesData when loadReports is called', () => {
    spyOn(component, 'loadSalesData');
    component.loadReports();
    expect(component.loadSalesData).toHaveBeenCalled();
  });

  // Test 3: table rows should render with correct data when tableData is populated
  it('should display data in the table when tableData is populated', () => {
    const mockAgentFeedbackData = [
      {
        agent: 'Agent 1',
        callDuration: '5 mins',
        customerFeedback: 'Positive',
      },
      {
        agent: 'Agent 2',
        callDuration: '10 mins',
        customerFeedback: 'Neutral',
      },
    ];

    component.tableData = mockAgentFeedbackData;
    component.loadingAgentFeedbackData = false; // Set flag to false so the @else branch renders the table
    fixture.detectChanges();

    const tableRows = fixture.nativeElement.querySelectorAll(
      '[data-testid="agent-feedback-table-row"]',
    );
    expect(tableRows.length).toBe(2);

    const firstRowCells = tableRows[0].querySelectorAll('td');
    expect(firstRowCells[0].textContent).toContain('Agent 1');
    expect(firstRowCells[1].textContent).toContain('5 mins');
    expect(firstRowCells[2].textContent).toContain('Positive');

    const secondRowCells = tableRows[1].querySelectorAll('td');
    expect(secondRowCells[0].textContent).toContain('Agent 2');
    expect(secondRowCells[1].textContent).toContain('10 mins');
    expect(secondRowCells[2].textContent).toContain('Neutral');
  });

  // Test 4: loadingSalesData should be true before any HTTP response arrives so the spinner is visible
  it('should initialize loadingSalesData to true', () => {
    expect(component.loadingSalesData).toBeTrue();
  });

  // Test 5: loadingAgentPerformanceData should be true before any HTTP response arrives so the spinner is visible
  it('should initialize loadingAgentPerformanceData to true', () => {
    expect(component.loadingAgentPerformanceData).toBeTrue();
  });

  // Test 6: loadingCustomerFeedbackData should be true before any HTTP response arrives so the spinner is visible
  it('should initialize loadingCustomerFeedbackData to true', () => {
    expect(component.loadingCustomerFeedbackData).toBeTrue();
  });

  // Test 7: loadingReportTypesData should be true before any HTTP response arrives so the spinner is visible
  it('should initialize loadingReportTypesData to true', () => {
    expect(component.loadingReportTypesData).toBeTrue();
  });

  // Test 8: loadingAgentFeedbackData should be true before any HTTP response arrives so the spinner is visible
  it('should initialize loadingAgentFeedbackData to true', () => {
    expect(component.loadingAgentFeedbackData).toBeTrue();
  });

  // Test 9: loadingSalesData should be false after a successful HTTP response so the chart renders
  it('should set loadingSalesData to false after successful HTTP response', () => {
    const req = httpTestingController.expectOne(
      `${environment.apiBaseUrl}/dashboard/sales-data`,
    );
    req.flush([{ totalAmount: 5000, region: 'North' }]);
    expect(component.loadingSalesData).toBeFalse();
  });

  // Test 10: loadingAgentPerformanceData should be false after a successful HTTP response so the chart renders
  it('should set loadingAgentPerformanceData to false after successful HTTP response', () => {
    const req = httpTestingController.expectOne(
      `${environment.apiBaseUrl}/dashboard/agent-performance`,
    );
    req.flush([{ averagePerformance: 90, name: 'Agent A' }]);
    expect(component.loadingAgentPerformanceData).toBeFalse();
  });

  // Test 11: loadingCustomerFeedbackData should be false after a successful HTTP response so the chart renders
  it('should set loadingCustomerFeedbackData to false after successful HTTP response', () => {
    const req = httpTestingController.expectOne(
      `${environment.apiBaseUrl}/dashboard/customer-feedback`,
    );
    req.flush([{ feedbackType: 'Positive', averagePerformance: 80 }]);
    expect(component.loadingCustomerFeedbackData).toBeFalse();
  });

  // Test 12: loadingReportTypesData should be false after a successful HTTP response so the chart renders
  it('should set loadingReportTypesData to false after successful HTTP response', () => {
    const req = httpTestingController.expectOne(
      `${environment.apiBaseUrl}/dashboard/report-types`,
    );
    req.flush({
      reportTypes: ['Sales', 'Performance'],
      reportCounts: [10, 20],
    });
    expect(component.loadingReportTypesData).toBeFalse();
  });

  // Test 13: loadingAgentFeedbackData should be false after a successful HTTP response so the table renders
  it('should set loadingAgentFeedbackData to false after successful HTTP response', () => {
    const req = httpTestingController.expectOne(
      `${environment.apiBaseUrl}/dashboard/agent-feedback`,
    );
    req.flush([
      {
        agent: 'Agent 1',
        callDuration: '5 mins',
        customerFeedback: 'Positive',
      },
    ]);
    expect(component.loadingAgentFeedbackData).toBeFalse();
  });

  // Test 14: loadingSalesData should be false when HTTP request fails so the spinner does not hang
  it('should set loadingSalesData to false when HTTP request fails', () => {
    const req = httpTestingController.expectOne(
      `${environment.apiBaseUrl}/dashboard/sales-data`,
    );
    req.error(new ProgressEvent('error'));
    expect(component.loadingSalesData).toBeFalse();
  });

  // Test 15: loadingAgentPerformanceData should be false when HTTP request fails so the spinner does not hang
  it('should set loadingAgentPerformanceData to false when HTTP request fails', () => {
    const req = httpTestingController.expectOne(
      `${environment.apiBaseUrl}/dashboard/agent-performance`,
    );
    req.error(new ProgressEvent('error'));
    expect(component.loadingAgentPerformanceData).toBeFalse();
  });

  // Test 16: loadingCustomerFeedbackData should be false when HTTP request fails so the spinner does not hang
  it('should set loadingCustomerFeedbackData to false when HTTP request fails', () => {
    const req = httpTestingController.expectOne(
      `${environment.apiBaseUrl}/dashboard/customer-feedback`,
    );
    req.error(new ProgressEvent('error'));
    expect(component.loadingCustomerFeedbackData).toBeFalse();
  });

  // Test 17: loadingReportTypesData should be false when HTTP request fails so the spinner does not hang
  it('should set loadingReportTypesData to false when HTTP request fails', () => {
    const req = httpTestingController.expectOne(
      `${environment.apiBaseUrl}/dashboard/report-types`,
    );
    req.error(new ProgressEvent('error'));
    expect(component.loadingReportTypesData).toBeFalse();
  });

  // Test 18: loadingAgentFeedbackData should be false when HTTP request fails so the spinner does not hang
  it('should set loadingAgentFeedbackData to false when HTTP request fails', () => {
    const req = httpTestingController.expectOne(
      `${environment.apiBaseUrl}/dashboard/agent-feedback`,
    );
    req.error(new ProgressEvent('error'));
    expect(component.loadingAgentFeedbackData).toBeFalse();
  });
});
