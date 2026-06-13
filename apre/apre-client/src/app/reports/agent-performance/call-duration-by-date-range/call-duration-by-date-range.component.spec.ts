/**
 * File: call-duration-by-date-range.component.spec.ts
 * Description: Unit tests for CallDurationByDateRangeComponent.
 *
 * Changes:
 * - Added test to verify the submit button has a title tooltip of "Click to fetch data."
 */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { CallDurationByDateRangeComponent } from './call-duration-by-date-range.component';

describe('CallDurationByDateRangeComponent', () => {
  let component: CallDurationByDateRangeComponent;
  let fixture: ComponentFixture<CallDurationByDateRangeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, CallDurationByDateRangeComponent], // Import CallDurationByDateRangeComponent
    }).compileComponents();

    fixture = TestBed.createComponent(CallDurationByDateRangeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the title "Call Duration By Date Range"', () => {
    const compiled = fixture.nativeElement;
    const titleElement = compiled.querySelector('h1');
    expect(titleElement).toBeTruthy();
    expect(titleElement.textContent).toContain('Call Duration By Date Range');
  });

  it('should display the title "Call Duration By Date Range"', () => {
    const compiled = fixture.nativeElement;
    const titleElement = compiled.querySelector('h1');
    expect(titleElement).toBeTruthy();
    expect(titleElement.textContent).toContain('Call Duration By Date Range');
  });

  // Verifies the submit button exposes a title tooltip so users know what the button does.
  it('should display a tooltip on the submit button', () => {
    const compiled = fixture.nativeElement;
    const submitButton = compiled.querySelector(
      '[data-testid="submit-button"]',
    );
    expect(submitButton).toBeTruthy();
    expect(submitButton.getAttribute('title')).toBe('Click to fetch data.');
  });

  it('should update endDate when onEndDateSelected is called', () => {
    const testStartDate = new Date('2024-08-07');
    const testEndDate = new Date('2024-08-08');
    component.startDate = testStartDate; // Set a valid start date
    component.onEndDateSelected(testEndDate);
    expect(component.endDate).toEqual(testEndDate);
  });
});
