export abstract class UIElement {
  abstract name: string;
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
  name = "Header";

  constructor(h: number, w: number, x: number, y: number) {
    super(h, w, x, y);
  }
}

export class Footer extends UIElement {
  name = "Footer";

  constructor(h: number, w: number, x: number, y: number) {
    super(h, w, x, y);
  }
}

export class Container extends UIElement {
  name = "Container";

  constructor(h: number, w: number, x: number, y: number) {
    super(h, w, x, y);
  }
}

/*
 * TEXT BLOCKS SUCH AS TITLES AND LINKS
 * These ui elements contain real text.
 */

interface TextBlock {
  fsize: number;
  lheight: number;
  align: string;
  content?: string | undefined;

  setContent(c: string): void;
}

export class Title extends UIElement implements TextBlock {
  name = "Title";
  fsize: number;
  lheight: number;
  align: string;
  content?: string | undefined;

  constructor(h: number, w: number, x: number, y: number, fs: number, lh: number, a: string) {
    super(h, w, x, y);
    this.fsize = fs;
    this.lheight = lh;
    this.align = a;
  }

  setContent(c: string) {
    this.content = c;
  }
}

export class Link extends UIElement implements TextBlock {
  name = "Link";
  fsize: number;
  lheight: number;
  align: string;
  content?: string | undefined;

  constructor(h: number, w: number, x: number, y: number, fs: number, lh: number, a: string) {
    super(h, w, x, y);
    this.fsize = fs;
    this.lheight = lh;
    this.align = a;
  }

  setContent(c: string) {
    this.content = c;
  }
}

/*
 * OTHER ELEMENTS
 */

export class Text extends UIElement {
  name = "Text";
  nlines: number;

  constructor(h: number, w: number, x: number, y: number, l: number) {
    super(h, w, x, y);
    this.nlines = l;
  }
}

export class Image extends UIElement {
  name = "Image";

  constructor(h: number, w: number, x: number, y: number) {
    super(h, w, x, y);
  }
}

export class Icon extends UIElement {
  name = "Icon";
  svg: string;

  constructor(h: number, w: number, x: number, y: number, s: string) {
    super(h, w, x, y);
    this.svg = s;
  }
}

export class Burguer extends UIElement {
  name = "Burguer";

  constructor(h: number, w: number, x: number, y: number) {
    super(h, w, x, y);
  }
}

export class Button extends UIElement {
  name = "Button";
  fsize?: number | undefined;
  content?: string | undefined;

  constructor(h: number, w: number, x: number, y: number) {
    super(h, w, x, y);
  }

  setContent(c: string, fs: number) {
    this.content = c;
    this.fsize = fs;
  }
}

export class Dropdown extends UIElement {
  name = "Dropdown";

  constructor(h: number, w: number, x: number, y: number) {
    super(h, w, x, y);
  }
}

export class TextField extends UIElement {
  name = "TextField";

  constructor(h: number, w: number, x: number, y: number) {
    super(h, w, x, y);
  }
}

export class Radio extends UIElement {
  name = "Radio";

  constructor(h: number, w: number, x: number, y: number) {
    super(h, w, x, y);
  }
}

export class Checkbox extends UIElement {
  name = "Checkbox";

  constructor(h: number, w: number, x: number, y: number) {
    super(h, w, x, y);
  }
}
