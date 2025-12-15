import { Component, ViewChild } from '@angular/core';
import { TodayTimelineComponent } from "../../components/reminders/today-timeline-component/today-timeline-component";
import { ScheduleEditorComponent } from "../../components/reminders/schedual-editor-component/schedual-editor-component";
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reminders.page',
  imports: [TodayTimelineComponent, ScheduleEditorComponent,CommonModule],
  templateUrl: './reminders.page.html',
  styleUrl: './reminders.page.css',
})
export class RemindersPage {
@ViewChild(TodayTimelineComponent) timeline!: TodayTimelineComponent;

  onScheduleSaved(): void {
    this.timeline.refresh(); // ✅ update timeline when editor saves
  }
}
