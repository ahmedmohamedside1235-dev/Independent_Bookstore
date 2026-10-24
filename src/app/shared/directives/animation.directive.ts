import { Directive, ElementRef, inject, input } from '@angular/core';

@Directive({
  selector: '[animationClass]',
})
export class AnimationDirective {
  private element = inject(ElementRef<HTMLElement>);
  private observe?: IntersectionObserver;

  public animationClass = input.required<string>();
  public animationDelay = input<number>(0);

  ngOnInit() {
    let element = this.element.nativeElement;
    element.style.transitionDelay = `${this.animationDelay()}ms`;

    this.observe = new IntersectionObserver(
      (entries) => {
        let entry = entries[0];
        if (entry.isIntersecting) {
          element.classList.add(this.animationClass());
          this.observe?.unobserve(element);
        }
      },
      { threshold: 0.15 },
    );
    this.observe.observe(element);
  }

  ngOnDestroy(): void {
    this.observe?.disconnect();
  }
}
