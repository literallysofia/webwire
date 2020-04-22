import { Drawable } from "./drawable";
import { Line, IRectangle, random, p_trans } from "../utils";

export class Dropdown extends Drawable {
  lines?: Line[] | undefined;

  constructor(rect: IRectangle) {
    super(rect);
  }

  generate(randomOffset: number) {
    this.lines = [];
    let points = this.rectPoints(this.x, this.y, this.height, this.width);
    this.mutatePoints(points, randomOffset, this.height * this.width);

    let divider = [];
    divider.push(p_trans(points[1], -random(20, 40), 0), p_trans(points[2], -random(20, 40), 0));
    this.mutatePoints(divider, randomOffset, this.height * this.width);

    this.lines.push([points[0], points[1]]);
    this.lines.push([points[1], points[2]]);
    this.lines.push([points[2], points[3]]);
    this.lines.push([points[3], points[0]]);
    this.lines.push([divider[0], divider[1]]);
  }
}
