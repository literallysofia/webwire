import { ElementType, Ellipse, Anchor, TextBlock, random, p_lerp, p_trans } from "./utils";

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

  rectPoints(h: number, w: number, x: number, y: number): number[][] {
    var p1 = [x, y];
    var p2 = [x + w, y];
    var p3 = [x + w, y + h];
    var p4 = [x, y + h];

    return [p1, p2, p3, p4];
  }

  mutate(points: number[][], offset: number, value?: number) {
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

export class Header extends Drawable {
  name = ElementType.Header;
  lines?: number[][][];

  constructor(h: number, w: number, x: number, y: number) {
    super(h, w, x, y);
  }

  generate(randomize: boolean, randomOffset: number): void {
    this.lines = [];
    var points = this.rectPoints(this.height, this.width, this.x, this.y);

    if (randomize) this.mutate(points, randomOffset);

    this.lines.push([points[0], points[1]], [points[1], points[2]], [points[2], points[3]], [points[3], points[0]]);
  }
}

export class Title extends Drawable {
  name = ElementType.Title;
  fsize: number;
  lineHeight: number;
  align: string;
  text: string;
  textBlock?: TextBlock;

  constructor(h: number, w: number, x: number, y: number, s: number, lheight: number, a: string, t: string) {
    super(h, w, x, y);
    this.fsize = s;
    this.lineHeight = lheight;
    this.align = a;
    this.text = t;
  }

  setTextRandom(t: string) {
    this.text = t;
  }

  getWords(): string[] {
    const words = this.text.split(/\s+/g);
    if (!words[words.length - 1]) words.pop();
    if (!words[0]) words.shift();
    return words;
  }

  generate(randomize: boolean, randomOffset: number): void {
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

    this.textBlock = new TextBlock(x, this.y, this.fsize, this.lineHeight, anchor, this.getWords());
  }
}

export class Text extends Drawable {
  name = ElementType.Text;
  nlines: number;
  lines?: number[][][];

  constructor(h: number, w: number, x: number, y: number, l: number) {
    super(h, w, x, y);
    this.nlines = l;
  }

  generate(randomize: boolean, randomOffset: number): void {
    this.lines = [];
    var lineHeight = this.height / this.nlines;

    for (let i = 0; i < this.nlines; i++) {
      var nPoints = Math.floor((Math.random() * this.width) / 30 + 4);
      var points = [];

      for (let j = 0; j < nPoints; j++) {
        let frac = j / (nPoints - 1);
        let x = this.x + this.width * frac; // x position
        let xdeg = (Math.PI / 2) * x; // frequency
        // amplitude * sin(frequency) + offset
        let y = random(2, lineHeight / 2) * Math.sin(xdeg) + (this.y + lineHeight * i + lineHeight / 2);

        points.push([x, y]);
      }
      if (randomize) this.mutate(points, randomOffset);
      this.lines.push(points);
    }
  }
}

export class Image extends Drawable {
  name = ElementType.Image;
  lines?: number[][][];

  constructor(h: number, w: number, x: number, y: number) {
    super(h, w, x, y);
  }

  generate(randomize: boolean, randomOffset: number): void {
    this.lines = [];
    var points = this.rectPoints(this.height, this.width, this.x, this.y);

    if (randomize) this.mutate(points, randomOffset);

    var cross = [];
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

export class Button extends Drawable {
  name = ElementType.Button;
  lines?: number[][][];

  constructor(h: number, w: number, x: number, y: number) {
    super(h, w, x, y);
  }

  generate(randomize: boolean, randomOffset: number): void {
    this.lines = [];
    var points = this.rectPoints(this.height, this.width, this.x, this.y);

    if (randomize) this.mutate(points, randomOffset);

    var nPoints = Math.floor((Math.random() * this.width) / 30 + 4);
    var line = [];
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

    if (randomize) this.mutate(line, randomOffset);

    this.lines.push([points[0], points[1]]);
    this.lines.push([points[1], points[2]]);
    this.lines.push([points[2], points[3]]);
    this.lines.push([points[3], points[0]]);
    this.lines.push(line);
  }
}

export class Dropdown extends Drawable {
  name = ElementType.Dropdown;
  lines?: number[][][];

  constructor(h: number, w: number, x: number, y: number) {
    super(h, w, x, y);
  }

  generate(randomize: boolean, randomOffset: number): void {
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
  name = ElementType.TextField;
  lines?: number[][][];

  constructor(h: number, w: number, x: number, y: number) {
    super(h, w, x, y);
  }

  generate(randomize: boolean, randomOffset: number): void {
    this.lines = [];
    var points = this.rectPoints(this.height, this.width, this.x, this.y);

    if (randomize) this.mutate(points, randomOffset);

    this.lines.push([points[0], points[1]], [points[1], points[2]], [points[2], points[3]], [points[3], points[0]]);
  }
}

export class Radio extends Drawable {
  name = ElementType.Radio;
  ellipse?: Ellipse;

  constructor(h: number, w: number, x: number, y: number) {
    super(h, w, x, y);
  }

  generate(randomize: boolean, randomOffset: number): void {
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
  name = ElementType.Checkbox;
  lines?: number[][][];

  constructor(h: number, w: number, x: number, y: number) {
    super(h, w, x, y);
  }

  generate(randomize: boolean, randomOffset: number): void {
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
