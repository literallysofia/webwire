import { IRectangle, TextProps } from "./utils";

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

export class Icon extends IElement {
  svg: string;

  constructor(name: string, rect: IRectangle, svg: string) {
    super(name, rect);
    this.svg = svg;
  }
}

export class Text extends IElement {
  nlines: number;

  constructor(name: string, rect: IRectangle, nlines: number) {
    super(name, rect);
    this.nlines = nlines;
  }
}

export class RealText extends IElement {
  align: string;
  content: string;
  fsize: number;
  lheight: number;

  constructor(name: string, rect: IRectangle, props: TextProps) {
    super(name, rect);
    this.align = props.align;
    this.content = props.content;
    this.fsize = props.fsize;
    this.lheight = props.lheight;
  }
}
