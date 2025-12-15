import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TodayTimelineComponent } from './today-timeline-component';

describe('TodayTimelineComponent', () => {
  let component: TodayTimelineComponent;
  let fixture: ComponentFixture<TodayTimelineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TodayTimelineComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TodayTimelineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
