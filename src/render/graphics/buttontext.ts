import { DrawableText } from "./drawable";
import { Button } from "./button";
import { IRectangle, TextProps, Anchor, TextBlock, t_words } from "../utils";

export class ButtonText extends Button implements DrawableText {
  align: string;
  content: string;
  fsize: number;
  lheight: number;
  textBlock?: TextBlock | undefined;

  constructor(rect: IRectangle, props: TextProps) {
    super(rect);
    this.align = props.align;
    this.content = props.content;
    this.fsize = props.fsize;
    this.lheight = props.lheight;
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
