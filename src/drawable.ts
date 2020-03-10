import * as Utils from "./utils";

var randomize = true;
var randomOffset = 10;

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

  mutate(points: number[][], value?: number) {
    var offset = randomOffset;
    if (value !== undefined) offset *= value;

    for (var i in points) {
      var point = points[i];
      point[0] += Math.random() * offset * 2 - offset;
      point[1] += Math.random() * offset * 2 - offset;
    }
  }

  abstract generate(): void;
}

export class Text extends Drawable {
  name: string;
  nLines: number;
  lines: number[][][];

  constructor(h: number, w: number, x: number, y: number, l: number) {
    super(h, w, x, y);
    this.name = "text";
    this.nLines = l;
    this.lines = [];
  }

  generate(): void {
    var lineHeight = this.height / this.nLines;

    for (let i = 0; i < this.nLines; i++) {
      var nPoints = Math.floor((Math.random() * this.width) / 30 + 4);
      var points = [];

      for (let j = 0; j < nPoints; j++) {
        let frac = j / (nPoints - 1);
        let x = this.x + this.width * frac; // x position
        let xdeg = (Math.PI / 2) * x; // frequency
        // amplitude * sin(frequency) + offset
        let y = Utils.random(2, lineHeight / 2) * Math.sin(xdeg) + (this.y + lineHeight * i + lineHeight / 2);

        points.push([x, y]);
      }
      this.lines.push(points);
    }
  }
}

export class Image extends Drawable {
  name: string;

  constructor(h: number, w: number, x: number, y: number) {
    super(h, w, x, y);
    this.name = "image";
  }

  generate(): void {}
}

export class Input extends Drawable {
  name: string;
  type: string;
  lines: any;

  constructor(h: number, w: number, x: number, y: number, t: string) {
    super(h, w, x, y);
    this.name = "input";
    this.type = t;
  }

  generate(): void {
    var points = this.rectPoints(this.height, this.width, this.x, this.y);
    this.lines = [];

    if (randomize) this.mutate(points, 0.6);

    this.lines.push([points[0], points[1]], [points[1], points[2]], [points[2], points[3]], [points[3], points[0]]);
  }
}

export class Button extends Drawable {
  name: string;

  constructor(h: number, w: number, x: number, y: number) {
    super(h, w, x, y);
    this.name = "button";
  }

  generate(): void {}
}

export class Dropdown extends Drawable {
  name: string;

  constructor(h: number, w: number, x: number, y: number) {
    super(h, w, x, y);
    this.name = "dropdown";
  }

  generate(): void {}
}
