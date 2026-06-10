/**
 * File: sales-by-category.component.spec.ts
 * Description: Unit tests for the SalesByCategoryComponent. Tests verify that
 *   the component renders correctly, displays the expected title, initializes
 *   the category form in an invalid state, and prevents submission without a selection.
 *
 * Changes (new file):
 * - Created this spec file alongside sales-by-category.component.ts to satisfy
 *   TDD requirements for the Sales by Category feature.
 * - Test 1 confirms the component mounts without errors.
 * - Test 2 asserts the page title renders as "Sales by Category".
 * - Test 3 ensures the form is invalid on load (no category pre-selected).
 * - Test 4 verifies that submitting without a selection leaves the form invalid.
 */

import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { SalesByCategoryComponent } from './sales-by-category.component';

describe('SalesByCategoryComponent', () => {
  let component: SalesByCategoryComponent;
  let fixture: ComponentFixture<SalesByCategoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, SalesByCategoryComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SalesByCategoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Test 1: page title should be "Sales by Category"
  it('should display the title "Sales by Category"', () => {
    const compiled = fixture.nativeElement;
    const titleElement = compiled.querySelector('h1');
    expect(titleElement).toBeTruthy();
    expect(titleElement.textContent).toContain('Sales by Category');
  });

  // Test 2: category form control should start null and invalid until a value is selected
  it('should initialize the categoryForm with a null value and be invalid', () => {
    const categoryControl = component.categoryForm.controls['category'];
    expect(categoryControl.value).toBeNull();
    expect(categoryControl.valid).toBeFalse();
  });

  // Test 3: form should remain invalid when submitted without a category selection
  it('should not submit the form if no category is selected', () => {
    spyOn(component, 'onSubmit').and.callThrough();

    const compiled = fixture.nativeElement;
    const submitButton = compiled.querySelector('.form__actions button');
    submitButton.click();

    expect(component.onSubmit).toHaveBeenCalled();
    expect(component.categoryForm.valid).toBeFalse();
  });
});
