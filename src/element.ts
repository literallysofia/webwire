export abstract class Element {
  type: string;
  height: number;
  width: number;
  x: number;
  y: number;

  constructor(t: string, h: number, w: number, x: number, y: number) {
    this.type = t;
    this.height = h;
    this.width = w;
    this.x = x;
    this.y = y;
  }
}

export class Text extends Element {
  lines: number;

  constructor(t: string, h: number, w: number, x: number, y: number, l: number) {
    super(t, h, w, x, y);
    this.lines = l;
  }
}

export class Image extends Element {
  constructor(t: string, h: number, w: number, x: number, y: number) {
    super(t, h, w, x, y);
  }
}

export class Input extends Element {
  variant: string;

  constructor(t: string, h: number, w: number, x: number, y: number, v: string) {
    super(t, h, w, x, y);
    this.variant = v;
  }
}

export class Button extends Element {
  constructor(t: string, h: number, w: number, x: number, y: number) {
    super(t, h, w, x, y);
  }
}
