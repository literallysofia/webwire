import { Drawable } from "./drawable";
import { Ellipse, IRectangle } from "../utils";

export class Radio extends Drawable {
  ellipse?: Ellipse | undefined;

  constructor(rect: IRectangle) {
    super(rect);
  }

  generate(randomOffset: number) {
    this.mutateCoords(randomOffset);
    let cx = this.x + this.width / 2;
    let cy = this.y + this.height / 2;
    this.ellipse = { cx: cx, cy: cy, height: this.height, width: this.width };
  }
}
