import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SchedualEditorComponent } from './schedual-editor-component';

describe('SchedualEditorComponent', () => {
  let component: SchedualEditorComponent;
  let fixture: ComponentFixture<SchedualEditorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SchedualEditorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SchedualEditorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
