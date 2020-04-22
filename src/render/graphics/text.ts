import { Drawable } from "./drawable";
import { Line, Point, IRectangle, random } from "../utils";

export class Text extends Drawable {
  nlines: number;
  lines?: Line[] | undefined;

  constructor(rect: IRectangle, nlines: number) {
    super(rect);
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
      this.mutatePoints(line, randomOffset, this.height * this.width);
      this.lines.push(line);
    }
  }
}
