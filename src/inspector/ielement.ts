import { IRectangle } from "./utils";

export abstract class IElement {
  abstract name: string;
  x: number;
  y: number;
  height: number;
  width: number;

  constructor(rect: IRectangle) {
    this.x = rect.x;
    this.y = rect.y;
    this.height = rect.height;
    this.width = rect.width;
  }
}

/*
 * HEADER, FOOTER AND CONTAINERS
 */

export class Header extends IElement {
  name = "Header";

  constructor(rect: IRectangle) {
    super(rect);
  }
}

export class Footer extends IElement {
  name = "Footer";

  constructor(rect: IRectangle) {
    super(rect);
  }
}

export class Container extends IElement {
  name = "Container";

  constructor(rect: IRectangle) {
    super(rect);
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

export class Title extends IElement implements TextBlock {
  name = "Title";
  fsize: number;
  lheight: number;
  align: string;
  content?: string | undefined;

  constructor(rect: IRectangle, fs: number, lh: number, a: string) {
    super(rect);
    this.fsize = fs;
    this.lheight = lh;
    this.align = a;
  }

  setContent(c: string) {
    this.content = c;
  }
}

export class Link extends IElement implements TextBlock {
  name = "Link";
  fsize: number;
  lheight: number;
  align: string;
  content?: string | undefined;

  constructor(rect: IRectangle, fs: number, lh: number, a: string) {
    super(rect);
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

export class Text extends IElement {
  name = "Text";
  nlines: number;

  constructor(rect: IRectangle, l: number) {
    super(rect);
    this.nlines = l;
  }
}

export class Image extends IElement {
  name = "Image";

  constructor(rect: IRectangle) {
    super(rect);
  }
}

export class Icon extends IElement {
  name = "Icon";
  svg: string;

  constructor(rect: IRectangle, s: string) {
    super(rect);
    this.svg = s;
  }
}

export class Burguer extends IElement {
  name = "Burguer";

  constructor(rect: IRectangle) {
    super(rect);
  }
}

export class Button extends IElement {
  name = "Button";
  fsize?: number | undefined;
  content?: string | undefined;

  constructor(rect: IRectangle) {
    super(rect);
  }

  setContent(c: string, fs: number) {
    this.content = c;
    this.fsize = fs;
  }
}

export class Dropdown extends IElement {
  name = "Dropdown";

  constructor(rect: IRectangle) {
    super(rect);
  }
}

export class TextField extends IElement {
  name = "TextField";

  constructor(rect: IRectangle) {
    super(rect);
  }
}

export class Radio extends IElement {
  name = "Radio";

  constructor(rect: IRectangle) {
    super(rect);
  }
}

export class Checkbox extends IElement {
  name = "Checkbox";

  constructor(rect: IRectangle) {
    super(rect);
  }
}
