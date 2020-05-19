import { DrawableText } from "./drawabletext";
import { IRectangle, TextProps, Anchor, Line, t_words } from "../utils";

export class ButtonText extends DrawableText {
  lines?: Line[] | undefined;

  constructor(rect: IRectangle, props: TextProps) {
    super(rect, props);
  }

  generate(randomOffset: number) {
    this.lines = [];
    let points = this.rectPoints(this.x, this.y, this.height, this.width);
    this.mutatePoints(points, randomOffset, this.height * this.width);

    this.lines.push([points[0], points[1]]);
    this.lines.push([points[1], points[2]]);
    this.lines.push([points[2], points[3]]);
    this.lines.push([points[3], points[0]]);

    this.mutateCoords(randomOffset);
    const x = this.x + this.width / 2;
    const y = this.y + this.height / 2;

    this.textBlock = {
      x: x,
      y: y,
      fsize: this.fsize,
      lheigth: this.lheight,
      anchor: Anchor.Middle,
      baseline: "middle",
      words: t_words(this.content),
    };
  }
}
