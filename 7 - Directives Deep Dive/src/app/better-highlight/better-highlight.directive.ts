import {
  Directive,
  Renderer2,
  OnInit,
  ElementRef,
  HostListener,
  HostBinding,
  Input
} from '@angular/core';

@Directive({
  selector: '[appBetterHighlight]'
})
export class BetterHighlightDirective implements OnInit {
  @Input() defaultColor: string = 'transparent';
  @Input('appBetterHighlight') highlightColor: string = 'blue';
  @HostBinding('style.backgroundColor') backgroundColor: string;

  constructor(private elRef: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    this.backgroundColor = this.defaultColor;
    // this.renderer.setStyle(
    //   this.elRef.nativeElement,
    //   'background-color',
    //   'blue'
    // );
    // this.renderer.setStyle(this.elRef.nativeElement, 'color', 'white');
  }

  @HostListener('mouseenter') mouseOver(eventData: Event) {
    // this.renderer.setStyle(
    //   this.elRef.nativeElement,
    //   'background-color',
    //   'blue'
    // );

    this.backgroundColor = this.highlightColor;

    this.renderer.setStyle(this.elRef.nativeElement, 'color', 'white');
  }

  @HostListener('mouseleave') mouseLeave(eventData: Event) {
    // this.renderer.setStyle(
    //   this.elRef.nativeElement,
    //   'background-color',
    //   'transparent'
    // );

    this.backgroundColor = this.defaultColor;

    this.renderer.setStyle(this.elRef.nativeElement, 'color', 'black');
  }
}
