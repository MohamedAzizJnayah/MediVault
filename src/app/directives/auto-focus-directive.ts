import { Directive, ElementRef, Input, AfterViewInit } from '@angular/core';

@Directive({
  selector: '[appAutoFocus]',
  standalone: true,
})
export class AutoFocusDirective implements AfterViewInit {
  @Input() appAutoFocus = true;

  constructor(private el: ElementRef<HTMLElement>) {}

  ngAfterViewInit(): void {
    if (!this.appAutoFocus) return;

    // petit timeout pour laisser Angular rendre le DOM (modals)
    setTimeout(() => {
      (this.el.nativeElement as HTMLElement).focus?.();
    }, 0);
  }
}
