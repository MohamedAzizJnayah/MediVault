import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatboWidget } from './chatbo-widget';

describe('ChatboWidget', () => {
  let component: ChatboWidget;
  let fixture: ComponentFixture<ChatboWidget>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChatboWidget]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatboWidget);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
