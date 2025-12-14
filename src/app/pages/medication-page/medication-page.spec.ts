import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MedicationPage } from './medication-page';

describe('MedicationPage', () => {
  let component: MedicationPage;
  let fixture: ComponentFixture<MedicationPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MedicationPage]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MedicationPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
