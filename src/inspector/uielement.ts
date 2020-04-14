import { ElementType } from "./utils";

export abstract class UIElement {
  height: number;
  width: number;
  x: number;
  y: number;

  constructor(h: number, w: number, x: number, y: number) {
    this.height = h;
    this.width = w;
    this.x = x;
    this.y = y;
  }
}

/*
 * HEADER, FOOTER AND CONTAINERS
 */

export class Header extends UIElement {
  name = ElementType.Header;

  constructor(h: number, w: number, x: number, y: number) {
    super(h, w, x, y);
  }
}

export class Footer extends UIElement {
  name = ElementType.Footer;

  constructor(h: number, w: number, x: number, y: number) {
    super(h, w, x, y);
  }
}

export class Container extends UIElement {
  name = ElementType.Container;

  constructor(h: number, w: number, x: number, y: number) {
    super(h, w, x, y);
  }
}

/*
 * TEXT BLOCKS SUCH AS TITLES AND LINKS
 * These ui elements contain real text.
 */

class TextBlock extends UIElement {
  fsize: number;
  lheight: number;
  align: string;
  content: string;

  constructor(h: number, w: number, x: number, y: number, fs: number, lh: number, a: string, c: string) {
    super(h, w, x, y);
    this.fsize = fs;
    this.lheight = lh;
    this.align = a;
    this.content = c;
  }
}

export class Title extends TextBlock {
  name = ElementType.Title;

  constructor(h: number, w: number, x: number, y: number, fs: number, lh: number, a: string, c: string) {
    super(h, w, x, y, fs, lh, a, c);
  }
}

export class Link extends TextBlock {
  name = ElementType.Link;

  constructor(h: number, w: number, x: number, y: number, fs: number, lh: number, a: string, c: string) {
    super(h, w, x, y, fs, lh, a, c);
  }
}

/*
 * OTHER ELEMENTS
 */

export class Text extends UIElement {
  name = ElementType.Text;
  nlines: number;

  constructor(h: number, w: number, x: number, y: number, l: number) {
    super(h, w, x, y);
    this.nlines = l;
  }
}

export class Image extends UIElement {
  name = ElementType.Image;

  constructor(h: number, w: number, x: number, y: number) {
    super(h, w, x, y);
  }
}

export class Icon extends UIElement {
  name = ElementType.Icon;
  svg: string;

  constructor(h: number, w: number, x: number, y: number, s: string) {
    super(h, w, x, y);
    this.svg = s;
  }
}

export class Burguer extends UIElement {
  name = ElementType.Burguer;

  constructor(h: number, w: number, x: number, y: number) {
    super(h, w, x, y);
  }
}

export class Button extends UIElement {
  name = ElementType.Button;
  fsize: number;
  content: string;

  constructor(h: number, w: number, x: number, y: number, fs: number, c: string) {
    super(h, w, x, y);
    this.fsize = fs;
    this.content = c;
  }
}

export class Dropdown extends UIElement {
  name = ElementType.Dropdown;

  constructor(h: number, w: number, x: number, y: number) {
    super(h, w, x, y);
  }
}

export class TextField extends UIElement {
  name = ElementType.TextField;

  constructor(h: number, w: number, x: number, y: number) {
    super(h, w, x, y);
  }
}

export class Radio extends UIElement {
  name = ElementType.Radio;

  constructor(h: number, w: number, x: number, y: number) {
    super(h, w, x, y);
  }
}

export class Checkbox extends UIElement {
  name = ElementType.Checkbox;

  constructor(h: number, w: number, x: number, y: number) {
    super(h, w, x, y);
  }
}
