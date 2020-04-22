import { Drawable } from "./drawable";
import { Line, Point, IRectangle, random } from "../utils";

export class Button extends Drawable {
  lines?: Line[] | undefined;

  constructor(rect: IRectangle) {
    super(rect);
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
    let points = this.rectPoints(this.x, this.y, this.height, this.width);
    this.mutatePoints(points, randomOffset, this.height * this.width);

    this.lines.push([points[0], points[1]]);
    this.lines.push([points[1], points[2]]);
    this.lines.push([points[2], points[3]]);
    this.lines.push([points[3], points[0]]);

    let textLine = this.getTextLine();
    this.mutatePoints(textLine, randomOffset, this.height * this.width);
    this.lines.push(textLine);
  }
}
