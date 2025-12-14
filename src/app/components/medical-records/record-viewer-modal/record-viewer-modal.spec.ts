import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RecordViewerModal } from './record-viewer-modal';

describe('RecordViewerModal', () => {
  let component: RecordViewerModal;
  let fixture: ComponentFixture<RecordViewerModal>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RecordViewerModal]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RecordViewerModal);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
