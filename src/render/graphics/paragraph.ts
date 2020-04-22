import { Drawable } from "./drawable";
import { Line, Point, IRectangle, random, p_lerp } from "../utils";

export class Paragraph extends Drawable {
  lines?: Line[] | undefined;

  constructor(rect: IRectangle) {
    super(rect);
  }

  generate(randomOffset: number) {
    this.lines = [];
    let points = this.rectPoints(this.x, this.y, this.height, this.width);
    this.mutatePoints(points, randomOffset, this.height * this.width);

    let cross: Point[] = [];
    cross.push(p_lerp(points[0], points[2], random(0.0, 0.2)), p_lerp(points[2], points[0], random(0.0, 0.2)));
    this.mutatePoints(cross, randomOffset, this.height * this.width);

    this.lines.push([points[0], points[1]]);
    this.lines.push([points[1], points[2]]);
    this.lines.push([points[2], points[3]]);
    this.lines.push([points[3], points[0]]);
    this.lines.push([cross[0], cross[1]]);
  }
}
