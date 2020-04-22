import { Drawable } from "./drawable";
import { Line, IRectangle } from "../utils";

export class TextField extends Drawable {
  lines?: Line[] | undefined;

  constructor(rect: IRectangle) {
    super(rect);
  }

  generate(randomOffset: number) {
    this.lines = [];
    let points = this.rectPoints(this.x, this.y, this.height, this.width);
    this.mutatePoints(points, randomOffset, this.height * this.width);
    this.lines.push([points[0], points[1]], [points[1], points[2]], [points[2], points[3]], [points[3], points[0]]);
  }
}
