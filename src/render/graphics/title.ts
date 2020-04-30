import { Drawable, DrawableText } from "./drawable";
import { IRectangle, TextProps, Anchor, TextBlock, t_words } from "../utils";

export class Title extends Drawable implements DrawableText {
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
    this.mutateCoords(randomOffset);
    this.mutateSize(randomOffset);

    let anchor = Anchor.Start;
    let x = this.x;
    if (this.align === "center") {
      anchor = Anchor.Middle;
      x = this.x + this.width / 2;
    } else if (this.align === "right") {
      anchor = Anchor.End;
      x = this.x + this.width;
    }

    this.textBlock = {
      x: x,
      y: this.y,
      fsize: this.fsize,
      lheigth: this.lheight,
      anchor: anchor,
      words: t_words(this.content),
    };
  }
}
