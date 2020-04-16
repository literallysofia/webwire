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
    var p1: Point = [x, y];
    var p2: Point = [x + w, y];
    var p3: Point = [x + w, y + h];
    var p4: Point = [x, y + h];

    return [p1, p2, p3, p4];
  }

  mutate(points: Point[], offset: number, value?: number) {
    if (value) {
      offset *= value;
    }

    for (var i in points) {
      var point = points[i];
      point[0] += Math.random() * offset * 2 - offset;
      point[1] += Math.random() * offset * 2 - offset;
    }
  }

  abstract generate(randomize: boolean, randomOffset: number): void;
}

export class Container extends Drawable {
  lines?: Line[];

  constructor(h: number, w: number, x: number, y: number) {
    super(h, w, x, y);
  }

  generate(randomize: boolean, randomOffset: number) {
    this.lines = [];
    var points = this.rectPoints(this.height, this.width, this.x, this.y);

    if (randomize) this.mutate(points, randomOffset);

    this.lines.push([points[0], points[1]], [points[1], points[2]], [points[2], points[3]], [points[3], points[0]]);
  }
}

export class Title extends Drawable {
  fsize: number;
  lineHeight: number;
  align: string;
  content: string;
  textBlock?: TextBlock;

  constructor(h: number, w: number, x: number, y: number, fs: number, lheight: number, a: string, c: string) {
    super(h, w, x, y);
    this.fsize = fs;
    this.lineHeight = lheight;
    this.align = a;
    this.content = c;
  }

  /*   setContent(c: string) {
    this.content = c;
  } */

  generate(randomize: boolean, randomOffset: number) {
    if (randomize) {
      this.x += Math.random() * randomOffset * 3 - randomOffset;
      this.y += Math.random() * randomOffset * 2 - randomOffset;
    }

    var anchor = Anchor.Start;
    var x = this.x;
    if (this.align === "center") {
      anchor = Anchor.Middle;
      x = this.x + this.width / 2;
    } else if (this.align === "right") {
      anchor = Anchor.End;
      x = this.x + this.width;
    }

    this.textBlock = new TextBlock(x, this.y, this.fsize, this.lineHeight, anchor, t_words(this.content));
  }
}

export class Text extends Drawable {
  nlines: number;
  lines?: Line[];

  constructor(h: number, w: number, x: number, y: number, l: number) {
    super(h, w, x, y);
    this.nlines = l;
  }

  generate(randomize: boolean, randomOffset: number) {
    this.lines = [];
    var lineHeight = this.height / this.nlines;

    for (let i = 0; i < this.nlines; i++) {
      var nPoints = Math.floor((Math.random() * this.width) / 30 + 4);
      var line: Point[] = [];

      for (let j = 0; j < nPoints; j++) {
        let frac = j / (nPoints - 1);
        let x = this.x + this.width * frac; // x position
        let xdeg = (Math.PI / 2) * x; // frequency
        // amplitude * sin(frequency) + offset
        let y = random(2, lineHeight / 2) * Math.sin(xdeg) + (this.y + lineHeight * i + lineHeight / 2);

        line.push([x, y]);
      }
      if (randomize) this.mutate(line, randomOffset);
      this.lines.push(line);
    }
  }
}

export class Link extends Drawable {
  fsize: number;
  lineHeight: number;
  align: string;
  text: string;
  textBlock?: TextBlock;

  constructor(h: number, w: number, x: number, y: number, fs: number, lheight: number, a: string, t: string) {
    super(h, w, x, y);
    this.fsize = fs;
    this.lineHeight = lheight;
    this.align = a;
    this.text = t;
  }

  generate(randomize: boolean, randomOffset: number) {
    var anchor = Anchor.Start;
    var x = this.x;
    if (this.align === "center") {
      anchor = Anchor.Middle;
      x = this.x + this.width / 2;
    } else if (this.align === "right") {
      anchor = Anchor.End;
      x = this.x + this.width;
    }
    this.textBlock = new TextBlock(x, this.y, this.fsize, this.lineHeight, anchor, t_words(this.text));
  }
}

export class Image extends Drawable {
  lines?: Line[];

  constructor(h: number, w: number, x: number, y: number) {
    super(h, w, x, y);
  }

  generate(randomize: boolean, randomOffset: number) {
    this.lines = [];
    var points = this.rectPoints(this.height, this.width, this.x, this.y);

    if (randomize) this.mutate(points, randomOffset);

    var cross: Point[] = [];
    cross.push(
      p_lerp(points[0], points[2], random(0.0, 0.2)),
      p_lerp(points[2], points[0], random(0.0, 0.2)),
      p_lerp(points[1], points[3], random(0.0, 0.2)),
      p_lerp(points[3], points[1], random(0.0, 0.2))
    );

    if (randomize) this.mutate(cross, randomOffset);

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

  constructor(h: number, w: number, x: number, y: number, s: string) {
    super(h, w, x, y);
    this.svg = s;
  }

  async generate(randomize: boolean, randomOffset: number) {
    var svgo = new SVGO({
      plugins: [{ convertShapeToPath: { convertArcs: true } }, { convertPathData: true }, { mergePaths: true }],
    });
    var optimizedSvg = await svgo.optimize(this.svg);
    this.svg = optimizedSvg.data;
  }
}

export class Burguer extends Drawable {
  lines?: Line[];

  constructor(h: number, w: number, x: number, y: number) {
    super(h, w, x, y);
  }

  async generate(randomize: boolean, randomOffset: number) {
    this.lines = [];
    var lineHeight = this.height / 3;

    for (let i = 0; i < 3; i++) {
      var nPoints = Math.floor((Math.random() * this.width) / 30 + 4);
      var line: Point[] = [];

      for (let j = 0; j < nPoints; j++) {
        let frac = j / (nPoints - 1);
        let x = this.x + this.width * frac; // x position
        let xdeg = Math.PI * x; // frequency
        // amplitude * sin(frequency) + offset
        let y = Math.sin(xdeg) + (this.y + lineHeight * i + lineHeight / 2);

        line.push([x, y]);
      }
      if (randomize) this.mutate(line, randomOffset, 0.3);
      this.lines.push(line);
    }
  }
}

export class Button extends Drawable {
  fsize: number;
  content?: string;
  lines?: Line[];
  textBlock?: TextBlock;

  constructor(h: number, w: number, x: number, y: number, fs: number) {
    super(h, w, x, y);
    this.fsize = fs;
  }

  setContent(c: string) {
    this.content = c;
  }

  private getTextLine(): Point[] {
    var nPoints = Math.floor((Math.random() * this.width) / 30 + 4);
    var line: Point[] = [];
    var paddingLeft = random(0, 30);
    var paddingRight = random(0, 30) + paddingLeft;

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

  private getTextBlock(fs: number): TextBlock {
    var x = this.x + this.width / 2;
    var lineHeight = this.fsize + this.fsize / 2;
    if(this.content)
    return new TextBlock(x, this.y, fs, lineHeight, Anchor.Middle, t_words(this.content));
    else return new TextBlock(x, this.y, fs, lineHeight, Anchor.Middle, t_words(""));
  }

  generate(randomize: boolean, randomOffset: number) {
    this.lines = [];
    var points = this.rectPoints(this.height, this.width, this.x, this.y);

    if (randomize) this.mutate(points, randomOffset);

    this.lines.push([points[0], points[1]]);
    this.lines.push([points[1], points[2]]);
    this.lines.push([points[2], points[3]]);
    this.lines.push([points[3], points[0]]);

    if (!this.content) {
      let textLine = this.getTextLine();
      if (randomize) this.mutate(textLine, randomOffset);
      this.lines.push(textLine);
    } else {
      let fs = this.fsize;
      if (randomize) fs += Math.random() * randomOffset;
      this.textBlock = this.getTextBlock(fs);
    }
  }
}

export class Dropdown extends Drawable {
  lines?: Line[];

  constructor(h: number, w: number, x: number, y: number) {
    super(h, w, x, y);
  }

  generate(randomize: boolean, randomOffset: number) {
    this.lines = [];
    var points = this.rectPoints(this.height, this.width, this.x, this.y);

    if (randomize) this.mutate(points, randomOffset);

    var divider = [];
    divider.push(p_trans(points[1], -random(20, 40), 0), p_trans(points[2], -random(20, 40), 0));

    if (randomize) this.mutate(divider, randomOffset);

    this.lines.push([points[0], points[1]]);
    this.lines.push([points[1], points[2]]);
    this.lines.push([points[2], points[3]]);
    this.lines.push([points[3], points[0]]);
    this.lines.push([divider[0], divider[1]]);
  }
}

export class TextField extends Drawable {
  lines?: Line[];

  constructor(h: number, w: number, x: number, y: number) {
    super(h, w, x, y);
  }

  generate(randomize: boolean, randomOffset: number) {
    this.lines = [];
    var points = this.rectPoints(this.height, this.width, this.x, this.y);

    if (randomize) this.mutate(points, randomOffset);

    this.lines.push([points[0], points[1]], [points[1], points[2]], [points[2], points[3]], [points[3], points[0]]);
  }
}

export class Radio extends Drawable {
  ellipse?: Ellipse;

  constructor(h: number, w: number, x: number, y: number) {
    super(h, w, x, y);
  }

  generate(randomize: boolean, randomOffset: number) {
    var cx = this.x + this.width / 2;
    var cy = this.y + this.height / 2;

    if (randomize) {
      cx += Math.random() * randomOffset * 2 - randomOffset;
      cy += Math.random() * randomOffset * 2 - randomOffset;
    }

    this.ellipse = { cx: cx, cy: cy, height: this.height, width: this.width };
  }
}

export class Checkbox extends Drawable {
  lines?: Line[];

  constructor(h: number, w: number, x: number, y: number) {
    super(h, w, x, y);
  }

  generate(randomize: boolean, randomOffset: number) {
    this.lines = [];
    var points = this.rectPoints(this.height, this.width, this.x, this.y);

    if (randomize) this.mutate(points, randomOffset, 0.3);

    var checkmark = [];
    var point1 = p_trans(points[0], random(-this.width / 2, 0), random(0, this.height / 2));
    var point2 = p_trans(points[2], -this.width / 2, random(0, -this.height / 4));
    var point3 = p_trans(points[1], random(-this.width / 4, this.width / 4), random(0, -this.height / 4));

    checkmark.push(
      p_lerp(point1, point2, 0),
      p_lerp(point2, point1, 0),
      p_lerp(point2, point3, 0),
      p_lerp(point3, point2, 0)
    );

    this.lines.push([points[0], points[1]], [points[1], points[2]], [points[2], points[3]], [points[3], points[0]]);
    this.lines.push([checkmark[0], checkmark[1]]);
    this.lines.push([checkmark[2], checkmark[3]]);
  }
}