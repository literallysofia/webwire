import { Drawable } from "./drawable";
import { Line, Point, IRectangle } from "../utils";

export class Burger extends Drawable {
  lines?: Line[] | undefined;

  constructor(rect: IRectangle) {
    super(rect);
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
      this.mutatePoints(line, randomOffset, this.height * this.width);
      this.lines.push(line);
    }
  }
}
