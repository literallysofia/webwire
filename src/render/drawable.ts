import { Line, Point, Ellipse, Anchor, TextBlock, t_words, random, p_lerp, p_trans } from "./utils";
import SVGO from "svgo";

export abstract class Drawable {
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

  rectPoints(h: number, w: number, x: number, y: number): Point[] {
    const p1: Point = [x, y];
    const p2: Point = [x + w, y];
    const p3: Point = [x + w, y + h];
    const p4: Point = [x, y + h];

    return [p1, p2, p3, p4];
  }

  mutatePoints(points: Point[], offset: number, value?: number) {
    if (value) {
      offset *= value;
    }

    for (let i in points) {
      const point = points[i];
      point[0] += Math.random() * offset * 2 - offset;
      point[1] += Math.random() * offset * 2 - offset;
    }
  }

  mutateCoords(offset: number) {
    this.x += Math.random() * offset * 3 - offset;
    this.y += Math.random() * offset * 2 - offset;
  }

  abstract generate(randomOffset: number): void;
}

/*
 * CONTAINER
 */
export class Container extends Drawable {
  lines?: Line[] | undefined;

  constructor(h: number, w: number, x: number, y: number) {
    super(h, w, x, y);
  }

  generate(randomOffset: number) {
    this.lines = [];
    let points = this.rectPoints(this.height, this.width, this.x, this.y);
    this.mutatePoints(points, randomOffset);
    this.lines.push([points[0], points[1]], [points[1], points[2]], [points[2], points[3]], [points[3], points[0]]);
  }
}

/*
 * TEXT BLOCKS SUCH AS TITLES, LINKS AND BUTTONS
 * These ui elements contain real text.
 */

interface DrawableText {
  fsize: number;
  lheight: number;
  align: string;
  content: string;
  textBlock?: TextBlock | undefined;

  mutateSize(offset: number): void;
}

export class Title extends Drawable implements DrawableText {
  fsize: number;
  lheight: number;
  align: string;
  content: string;
  textBlock?: TextBlock | undefined;

  constructor(h: number, w: number, x: number, y: number, fsize: number, lheight: number, align: string, content: string) {
    super(h, w, x, y);
    this.fsize = fsize;
    this.lheight = lheight;
    this.align = align;
    this.content = content;
  }

  mutateSize(offset: number) {
    this.fsize += Math.random() * offset;
  }

  generate(randomOffset: number) {
    this.mutateCoords(randomOffset);
    this.mutateSize(randomOffset);

    let anchor = Anchor.Start;
    let x = this.x;
    if (this.align === "center") {
      anchor = Anchor.Middle;
      x = this.x + this.width / 2;
    } else if (this.align === "right") {
      anchor = Anchor.End;
      x = this.x + this.width;
    }

    this.textBlock = new TextBlock(x, this.y, this.fsize, this.lheight, anchor, t_words(this.content));
  }
}

export class Link extends Drawable implements DrawableText {
  fsize: number;
  lheight: number;
  align: string;
  content: string;
  textBlock?: TextBlock | undefined;

  constructor(h: number, w: number, x: number, y: number, fsize: number, lheight: number, align: string, content: string) {
    super(h, w, x, y);
    this.fsize = fsize;
    this.lheight = lheight;
    this.align = align;
    this.content = content;
  }

  mutateSize(offset: number): void {
    this.fsize += Math.random() * offset;
  }

  generate(randomOffset: number) {
    this.mutateCoords(randomOffset);
    this.mutateSize(randomOffset);

    let anchor = Anchor.Start;
    let x = this.x;
    if (this.align === "center") {
      anchor = Anchor.Middle;
      x = this.x + this.width / 2;
    } else if (this.align === "right") {
      anchor = Anchor.End;
      x = this.x + this.width;
    }
    this.textBlock = new TextBlock(x, this.y, this.fsize, this.lheight, anchor, t_words(this.content));
  }
}

export class Button extends Drawable {
  lines?: Line[] | undefined;

  constructor(h: number, w: number, x: number, y: number) {
    super(h, w, x, y);
  }

  private getTextLine(): Point[] {
    const nPoints = Math.floor((Math.random() * this.width) / 30 + 4);
    const paddingLeft = random(0, 30);
    const paddingRight = random(0, 30) + paddingLeft;
    let line: Point[] = [];

    for (let j = 0; j < nPoints; j++) {
      let frac = j / (nPoints - 1);
      let x = this.x + paddingLeft + (this.width - paddingRight) * frac; // x position
      let xdeg = (Math.PI / 4) * x; // frequency
      // amplitude * sin(frequency) + offset
      let y = random(1, this.height / 4) * Math.sin(xdeg) + (this.y + this.height / 2);

      line.push([x, y]);
    }
    return line;
  }

  generate(randomOffset: number) {
    this.lines = [];
    let points = this.rectPoints(this.height, this.width, this.x, this.y);
    this.mutatePoints(points, randomOffset);

    this.lines.push([points[0], points[1]]);
    this.lines.push([points[1], points[2]]);
    this.lines.push([points[2], points[3]]);
    this.lines.push([points[3], points[0]]);

    let textLine = this.getTextLine();
    this.mutatePoints(textLine, randomOffset);
    this.lines.push(textLine);
  }
}

export class TextButton extends Button implements DrawableText {
  fsize: number;
  lheight: number;
  align: string;
  content: string;
  textBlock?: TextBlock | undefined;

  constructor(h: number, w: number, x: number, y: number, fs: number, c: string) {
    super(h, w, x, y);
    this.fsize = fs;
    this.lheight = this.fsize + this.fsize / 2;
    this.align = "center";
    this.content = c;
  }

  mutateSize(offset: number) {
    this.fsize += Math.random() * offset;
  }

  generate(randomOffset: number) {
    this.lines = [];
    let points = this.rectPoints(this.height, this.width, this.x, this.y);
    this.mutatePoints(points, randomOffset);

    this.lines.push([points[0], points[1]]);
    this.lines.push([points[1], points[2]]);
    this.lines.push([points[2], points[3]]);
    this.lines.push([points[3], points[0]]);

    this.mutateCoords(randomOffset);
    this.mutateSize(randomOffset);
    const x = this.x + this.width / 2;

    this.textBlock = new TextBlock(x, this.y, this.fsize, this.lheight, Anchor.Middle, t_words(this.content));
  }
}

/*
 * TEXT PARAGRAPH
 */

export class Text extends Drawable {
  nlines: number;
  lines?: Line[] | undefined;

  constructor(h: number, w: number, x: number, y: number, nlines: number) {
    super(h, w, x, y);
    this.nlines = nlines;
  }

  generate(randomOffset: number) {
    this.lines = [];
    const lineHeight = this.height / this.nlines;

    for (let i = 0; i < this.nlines; i++) {
      const nPoints = Math.floor((Math.random() * this.width) / 30 + 4);
      let line: Point[] = [];

      for (let j = 0; j < nPoints; j++) {
        let frac = j / (nPoints - 1);
        let x = this.x + this.width * frac; // x position
        let xdeg = (Math.PI / 2) * x; // frequency
        // amplitude * sin(frequency) + offset
        let y = random(2, lineHeight / 2) * Math.sin(xdeg) + (this.y + lineHeight * i + lineHeight / 2);

        line.push([x, y]);
      }
      this.mutatePoints(line, randomOffset);
      this.lines.push(line);
    }
  }
}

/*
 * IMAGES AND ICONS
 */

export class Image extends Drawable {
  lines?: Line[] | undefined;

  constructor(h: number, w: number, x: number, y: number) {
    super(h, w, x, y);
  }

  generate(randomOffset: number) {
    this.lines = [];
    let points = this.rectPoints(this.height, this.width, this.x, this.y);
    this.mutatePoints(points, randomOffset);

    let cross: Point[] = [];
    cross.push(
      p_lerp(points[0], points[2], random(0.0, 0.2)),
      p_lerp(points[2], points[0], random(0.0, 0.2)),
      p_lerp(points[1], points[3], random(0.0, 0.2)),
      p_lerp(points[3], points[1], random(0.0, 0.2))
    );
    this.mutatePoints(cross, randomOffset);

    this.lines.push([points[0], points[1]]);
    this.lines.push([points[1], points[2]]);
    this.lines.push([points[2], points[3]]);
    this.lines.push([points[3], points[0]]);
    this.lines.push([cross[0], cross[1]]);
    this.lines.push([cross[3], cross[2]]);
  }
}

export class Icon extends Drawable {
  svg: string;

  constructor(h: number, w: number, x: number, y: number, svg: string) {
    super(h, w, x, y);
    this.svg = svg;
  }

  async generate() {
    const svgo = new SVGO({
      plugins: [{ convertShapeToPath: { convertArcs: true } }, { convertPathData: true }, { mergePaths: true }],
    });
    const optimizedSvg = await svgo.optimize(this.svg);
    this.svg = optimizedSvg.data;
  }
}

/*
 * BURGUER BUTTON AND DROPDOWN
 */

export class Burguer extends Drawable {
  lines?: Line[] | undefined;

  constructor(h: number, w: number, x: number, y: number) {
    super(h, w, x, y);
  }

  async generate(randomOffset: number) {
    this.lines = [];
    const lineHeight = this.height / 3;

    for (let i = 0; i < 3; i++) {
      const nPoints = Math.floor((Math.random() * this.width) / 30 + 4);
      let line: Point[] = [];

      for (let j = 0; j < nPoints; j++) {
        let frac = j / (nPoints - 1);
        let x = this.x + this.width * frac; // x position
        let xdeg = Math.PI * x; // frequency
        // amplitude * sin(frequency) + offset
        let y = Math.sin(xdeg) + (this.y + lineHeight * i + lineHeight / 2);

        line.push([x, y]);
      }
      this.mutatePoints(line, randomOffset, 0.3);
      this.lines.push(line);
    }
  }
}

export class Dropdown extends Drawable {
  lines?: Line[] | undefined;

  constructor(h: number, w: number, x: number, y: number) {
    super(h, w, x, y);
  }

  generate(randomOffset: number) {
    this.lines = [];
    let points = this.rectPoints(this.height, this.width, this.x, this.y);
    this.mutatePoints(points, randomOffset);

    let divider = [];
    divider.push(p_trans(points[1], -random(20, 40), 0), p_trans(points[2], -random(20, 40), 0));
    this.mutatePoints(divider, randomOffset);

    this.lines.push([points[0], points[1]]);
    this.lines.push([points[1], points[2]]);
    this.lines.push([points[2], points[3]]);
    this.lines.push([points[3], points[0]]);
    this.lines.push([divider[0], divider[1]]);
  }
}

/*
 * INPUTS
 */

export class TextField extends Drawable {
  lines?: Line[] | undefined;

  constructor(h: number, w: number, x: number, y: number) {
    super(h, w, x, y);
  }

  generate(randomOffset: number) {
    this.lines = [];
    let points = this.rectPoints(this.height, this.width, this.x, this.y);
    this.mutatePoints(points, randomOffset);
    this.lines.push([points[0], points[1]], [points[1], points[2]], [points[2], points[3]], [points[3], points[0]]);
  }
}

export class Radio extends Drawable {
  ellipse?: Ellipse | undefined;

  constructor(h: number, w: number, x: number, y: number) {
    super(h, w, x, y);
  }

  generate(randomOffset: number) {
    this.mutateCoords(randomOffset);
    let cx = this.x + this.width / 2;
    let cy = this.y + this.height / 2;
    this.ellipse = { cx: cx, cy: cy, height: this.height, width: this.width };
  }
}

export class Checkbox extends Drawable {
  lines?: Line[] | undefined;

  constructor(h: number, w: number, x: number, y: number) {
    super(h, w, x, y);
  }

  generate(randomOffset: number) {
    this.lines = [];
    let points = this.rectPoints(this.height, this.width, this.x, this.y);
    this.mutatePoints(points, randomOffset, 0.3);

    let checkmark = [];
    const point1 = p_trans(points[0], random(-this.width / 2, 0), random(0, this.height / 2));
    const point2 = p_trans(points[2], -this.width / 2, random(0, -this.height / 4));
    const point3 = p_trans(points[1], random(-this.width / 4, this.width / 4), random(0, -this.height / 4));

    checkmark.push(p_lerp(point1, point2, 0), p_lerp(point2, point1, 0), p_lerp(point2, point3, 0), p_lerp(point3, point2, 0));

    this.lines.push([points[0], points[1]], [points[1], points[2]], [points[2], points[3]], [points[3], points[0]]);
    this.lines.push([checkmark[0], checkmark[1]]);
    this.lines.push([checkmark[2], checkmark[3]]);
  }
}
