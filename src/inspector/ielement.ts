import { IRectangle } from "./utils";

export class IElement {
  name: string;
  x: number;
  y: number;
  height: number;
  width: number;

  constructor(name: string, rect: IRectangle) {
    this.name = name;
    this.x = rect.x;
    this.y = rect.y;
    this.height = rect.height;
    this.width = rect.width;
  }
}

export class Button extends IElement {
  content: string;
  fsize: number;

  constructor(name: string, rect: IRectangle, content: string, fsize: number) {
    super(name, rect);
    this.content = content;
    this.fsize = fsize;
  }
}

export class Icon extends IElement {
  svg: string;

  constructor(name: string, rect: IRectangle, s: string) {
    super(name, rect);
    this.svg = s;
  }
}

export class Text extends IElement {
  nlines: number;

  constructor(name: string, rect: IRectangle, l: number) {
    super(name, rect);
    this.nlines = l;
  }
}

export class RealText extends IElement {
  fsize: number;
  lheight: number;
  align: string;
  content?: string | undefined;

  constructor(name: string, rect: IRectangle, fs: number, lh: number, a: string) {
    super(name, rect);
    this.fsize = fs;
    this.lheight = lh;
    this.align = a;
  }

  setContent(c: string) {
    this.content = c;
  }
}
