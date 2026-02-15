declare global {
  interface Window {
    Marquee: typeof Marquee;
  }
}

type MarqueeOptions = {
  loop?: boolean;
  pauseable?: boolean;
  iterations?: number;
  duration?: number;
  direction?: "ltr" | "rtl" | "ttb" | "btt";
};

export class Marquee {
  private elem: HTMLElement;
  private marqueeElem: HTMLElement | null = null;

  // Configuration
  private loop: boolean;
  private pauseable: boolean;
  private iterations: number;
  private duration: number;
  private direction: "ltr" | "rtl" | "ttb" | "btt";

  // Dimensions & Logic
  private elemOuterSize: number = 0;
  private elemInnerSize: number = 0;
  private milestone: number = 0;
  private ltrCond: number = 0;
  private loopCnt: number = 0;
  private start: number = 0;
  private distancePerIteration: number = 0;

  // State
  private paused: boolean = false;
  private process: number | undefined | ReturnType<typeof setInterval>; // ReturnType for Node/Browser compatibility
  private observer: IntersectionObserver | null = null;

  // Helpers derived from direction
  private dimension: "width" | "height";
  private childDimensions: number[] = [];

  constructor(elem: HTMLElement, options: MarqueeOptions = {}) {
    this.elem = elem;

    this.loop = options.loop ?? true;
    this.pauseable = options.pauseable ?? true;
    this.iterations = options.iterations ?? 1;
    this.duration = options.duration || 5; // seconds
    this.direction = options.direction || "ltr";

    // Helper derivations
    this.dimension = this.direction.includes("tt") ? "height" : "width";

    // Initial speed calculation (base, sign applied later)
    this.distancePerIteration = 10 / (this.duration * 1000);

    this.setup();
  }

  private setup(): void {
    this.elemOuterSize = this.elem.getBoundingClientRect()[this.dimension];

    // Calculate total inner size of children
    (Array.from(this.elem.children) as HTMLElement[]).forEach((child) => {
      const childSize = child.getBoundingClientRect()[this.dimension];

      this.elemInnerSize += childSize;
      this.childDimensions.push(childSize);
      child.style.setProperty(`min-${this.dimension}`, `${childSize}px`);
    });

    if (this.elemInnerSize === 0) {
      return;
    }

    // elemOuterSize = 1800, elemInnerSize = 600, elemCount = 4
    const elemCount = Math.ceil(
      (this.elemOuterSize + this.elemInnerSize) / this.elemInnerSize,
    );

    const elemHTML = this.elem.innerHTML;

    this.marqueeElem = document.createElement("div");
    this.marqueeElem.style.setProperty(
      this.dimension,
      `${this.elemInnerSize * (elemCount - 1)}px`,
    );
    this.marqueeElem.style.setProperty("white-space", "nowrap");
    this.marqueeElem.style.setProperty("position", "relative");
    this.marqueeElem.style.setProperty("display", "flex");
    this.marqueeElem.style.setProperty(
      "flex-direction",
      this.dimension === "width" ? "row" : "column",
    );

    this.elem.replaceChildren(this.marqueeElem);
    this.elem.style.setProperty("overflow", "clip");

    for (let i = 0; i < elemCount; i++) {
      this.marqueeElem.innerHTML += elemHTML;
    }

    if (this.iterations) {
      if (this.direction === "ltr" || this.direction === "ttb") {
        this.start = -this.elemInnerSize;
      }
    } else {
      this.ltrCond = this.elemOuterSize;
      if (this.direction === "rtl" || this.direction === "btt") {
        this.milestone = this.ltrCond;
      }
    }

    // Direction specific logic
    if (this.direction === "ltr" || this.direction === "ttb") {
      this.milestone = -this.elemInnerSize;
    } else if (this.direction === "rtl" || this.direction === "btt") {
      this.distancePerIteration = -this.distancePerIteration;
    }

    this.init();
  }

  private init(): void {
    this.process = setInterval(this.play, 10);

    if (this.pauseable) {
      this.elem.addEventListener("mouseenter", this.handleMouseEnter);
      this.elem.addEventListener("mouseleave", this.handleMouseLeave);
    }

    this.observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            this.paused = false;
          } else {
            this.paused = true;
          }
        });
      },
      { threshold: 0.1 },
    );
    this.observer.observe(this.elem);
  }

  // Arrow function to auto-bind 'this' context
  private play = (): void => {
    if (this.paused || !this.marqueeElem) {
      return;
    }

    this.marqueeElem.style.setProperty(
      "transform",
      `translate${this.dimension === "width" ? "X" : "Y"}(${this.start}px)`,
    );
    this.start += this.distancePerIteration * this.elemInnerSize;

    if (this.start > this.ltrCond || this.start < -this.elemInnerSize) {
      this.start = this.milestone;
      this.loopCnt++;

      if (this.loop !== true && this.loopCnt >= this.iterations) {
        this.marqueeElem.style.setProperty("transform", "");
      }
    }
  };

  private handleMouseEnter = (): void => {
    this.paused = true;
  };

  private handleMouseLeave = (): void => {
    this.paused = false;
  };

  // Public method to destroy instance
  public destroy(): void {
    if (this.process) {
      clearInterval(this.process);
    }

    if (this.pauseable) {
      this.elem.removeEventListener("mouseenter", this.handleMouseEnter);
      this.elem.removeEventListener("mouseleave", this.handleMouseLeave);
    }

    if (this.observer) {
      this.observer.disconnect();
    }
  }
}
