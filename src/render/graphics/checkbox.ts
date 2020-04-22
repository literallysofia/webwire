import { Drawable } from "./drawable";
import { Line, IRectangle, random, p_trans, p_lerp } from "../utils";

export class Checkbox extends Drawable {
  lines?: Line[] | undefined;

  constructor(rect: IRectangle) {
    super(rect);
  }

  generate(randomOffset: number) {
    this.lines = [];
    let points = this.rectPoints(this.x, this.y, this.height, this.width);
    this.mutatePoints(points, randomOffset, this.height * this.width);

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
