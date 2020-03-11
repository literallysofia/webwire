import * as Utils from "./utils";

var textField = ["text", "password", "email", "search", "url"];
var randomize = true;
var randomOffset = 10;

export abstract class Drawable {
  height: number;
  width: number;
  x: number;
  y: number;
  lines?: number[][][];

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
    if (value) {
      offset *= value;
    }

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

  constructor(h: number, w: number, x: number, y: number, l: number) {
    super(h, w, x, y);
    this.name = "text";
    this.nLines = l;
  }

  generate(): void {
    this.lines = [];
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

  generate(): void {
    this.lines = [];
    var points = this.rectPoints(this.height, this.width, this.x, this.y);

    if (randomize) this.mutate(points);

    var cross = [];
    cross.push(
      Utils.p_lerp(points[0], points[2], Utils.random(0.0, 0.2)),
      Utils.p_lerp(points[2], points[0], Utils.random(0.0, 0.2)),
      Utils.p_lerp(points[1], points[3], Utils.random(0.0, 0.2)),
      Utils.p_lerp(points[3], points[1], Utils.random(0.0, 0.2))
    );

    if (randomize) this.mutate(cross);

    this.lines.push([points[0], points[1]]);
    this.lines.push([points[1], points[2]]);
    this.lines.push([points[2], points[3]]);
    this.lines.push([points[3], points[0]]);
    this.lines.push([cross[0], cross[1]]);
    this.lines.push([cross[3], cross[2]]);
  }
}

export class Button extends Drawable {
  name: string;

  constructor(h: number, w: number, x: number, y: number) {
    super(h, w, x, y);
    this.name = "button";
  }

  generate(): void {
    this.lines = [];
    var points = this.rectPoints(this.height, this.width, this.x, this.y);

    if (randomize) this.mutate(points, 0.5);

    var nPoints = Math.floor((Math.random() * this.width) / 30 + 4);
    var text = [];
    var paddingLeft = Utils.random(10, 30);
    var paddingRight = Utils.random(10, 30) + paddingLeft;

    for (let j = 0; j < nPoints; j++) {
      let frac = j / (nPoints - 1);
      let x = this.x + paddingLeft + (this.width - paddingRight) * frac; // x position
      let xdeg = (Math.PI / 4) * x; // frequency
      // amplitude * sin(frequency) + offset
      let y = Utils.random(this.height / 6, this.height / 4) * Math.sin(xdeg) + (this.y + this.height / 2);

      text.push([x, y]);
    }

    this.lines.push([points[0], points[1]]);
    this.lines.push([points[1], points[2]]);
    this.lines.push([points[2], points[3]]);
    this.lines.push([points[3], points[0]]);
    this.lines.push(text);
  }
}

export class Dropdown extends Drawable {
  name: string;

  constructor(h: number, w: number, x: number, y: number) {
    super(h, w, x, y);
    this.name = "dropdown";
  }

  generate(): void {
    this.lines = [];
    var points = this.rectPoints(this.height, this.width, this.x, this.y);

    if (randomize) this.mutate(points, 0.5);

    var divider = [];
    divider.push(
      Utils.p_trans(points[1], -Utils.random(20, 40), 0),
      Utils.p_trans(points[2], -Utils.random(20, 40), 0)
    );

    if (randomize) this.mutate(divider, 0.6);

    this.lines.push([points[0], points[1]]);
    this.lines.push([points[1], points[2]]);
    this.lines.push([points[2], points[3]]);
    this.lines.push([points[3], points[0]]);
    this.lines.push([divider[0], divider[1]]);
  }
}

export class Input extends Drawable {
  name: string;
  type: string;

  constructor(h: number, w: number, x: number, y: number, t: string) {
    super(h, w, x, y);
    this.name = "input";
    this.type = t;
  }

  generate(): void {
    if (textField.includes(this.type)) {
      this.lines = [];
      var points = this.rectPoints(this.height, this.width, this.x, this.y);

      if (randomize) this.mutate(points, 0.5);

      this.lines.push([points[0], points[1]], [points[1], points[2]], [points[2], points[3]], [points[3], points[0]]);
    }
  }
}
