/**
 * File: agent-performance-by-region.component.spec.ts
 * Description: Unit tests for the AgentPerformanceByRegionComponent. Tests verify
 *   that the component renders correctly, displays the expected title, initializes
 *   the region form in an invalid state, and starts with empty data arrays.
 *
 * Changes (new file):
 * - Created this spec file alongside agent-performance-by-region.component.ts to
 *   satisfy TDD requirements for the Agent Performance by Region feature.
 * - Test 1 asserts the page title renders as "Agent Performance by Region".
 * - Test 2 ensures the form is invalid on load (no region pre-selected).
 * - Test 3 verifies that agents and agentData arrays are empty on initialization.
 */
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { AgentPerformanceByRegionComponent } from './agent-performance-by-region.component';

describe('AgentPerformanceByRegionComponent', () => {
  let component: AgentPerformanceByRegionComponent;
  let fixture: ComponentFixture<AgentPerformanceByRegionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, AgentPerformanceByRegionComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(AgentPerformanceByRegionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Test 1: page title should be "Agent Performance by Region"
  it('should display the title "Agent Performance by Region"', () => {
    const titleElement = fixture.nativeElement.querySelector(
      '[data-testid="page-title"]',
    );
    expect(titleElement).toBeTruthy();
    expect(titleElement.textContent).toContain('Agent Performance by Region');
  });

  // Test 2: region form control should start null and invalid until a value is selected
  it('should initialize the regionForm with a null region value and be invalid', () => {
    const regionControl = component.regionForm.controls['region'];
    expect(regionControl.value).toBeNull();
    expect(regionControl.valid).toBeFalse();
  });

  // Test 3: agents and agentData arrays should be empty before any region is submitted
  it('should initialize with empty agents and agentData arrays', () => {
    expect(component.agents).toEqual([]);
    expect(component.agentData).toEqual([]);
  });
});
