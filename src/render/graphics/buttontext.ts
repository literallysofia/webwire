import { DrawableText } from "./drawable";
import { Button } from "./button";
import { IRectangle, Anchor, TextBlock, t_words } from "../utils";

export class ButtonText extends Button implements DrawableText {
  fsize: number;
  lheight: number;
  align: string;
  content: string;
  textBlock?: TextBlock | undefined;

  constructor(rect: IRectangle, fsize: number, c: string) {
    super(rect);
    this.fsize = fsize;
    this.lheight = this.fsize + this.fsize / 2;
    this.align = "center";
    this.content = c;
  }

  mutateSize(offset: number) {
    this.fsize += Math.random() * offset;
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
    this.mutateSize(randomOffset);
    const x = this.x + this.width / 2;

    this.textBlock = {
      x: x,
      y: this.y,
      fsize: this.fsize,
      lheigth: this.lheight,
      anchor: Anchor.Middle,
      words: t_words(this.content),
    };
  }
}
