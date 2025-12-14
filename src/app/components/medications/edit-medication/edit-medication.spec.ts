import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditMedication } from './edit-medication';

describe('EditMedication', () => {
  let component: EditMedication;
  let fixture: ComponentFixture<EditMedication>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditMedication]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditMedication);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
