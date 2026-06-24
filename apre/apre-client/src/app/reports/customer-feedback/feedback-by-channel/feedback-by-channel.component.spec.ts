/**
 * Author: Jarren Bess
 * Date: 6/24/2026
 * File: feedback-by-channel.component.spec.ts
 * Description: Unit tests for the FeedbackByChannelComponent
 *
 * Purpose:
 * Verifies that the component renders the correct title, starts with an empty
 * tableData array, and does not render the table before data arrives —
 * confirming the template guard prevents premature rendering.
 */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { FeedbackByChannelComponent } from './feedback-by-channel.component';

describe('FeedbackByChannelComponent', () => {
  let component: FeedbackByChannelComponent;
  let fixture: ComponentFixture<FeedbackByChannelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, FeedbackByChannelComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FeedbackByChannelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Test 1: page title should always be present and correctly labeled
  it('should display the title "Customer Feedback by Channel"', () => {
    const titleElement = fixture.nativeElement.querySelector(
      '[data-testid="page-title"]',
    );
    expect(titleElement).toBeTruthy();
    expect(titleElement.textContent).toContain('Customer Feedback by Channel');
  });

  // Test 2: tableData must be empty on init so the table guard starts false
  it('should initialize with an empty tableData array', () => {
    expect(component.tableData).toEqual([]);
  });

  // Test 3: table should not render until data is loaded
  it('should not render the table before data is loaded', () => {
    const tableElement = fixture.nativeElement.querySelector(
      '[data-testid="feedback-table"]',
    );
    expect(tableElement).toBeNull();
  });
});
