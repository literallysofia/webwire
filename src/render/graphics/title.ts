import { Drawable, DrawableText } from "./drawable";
import { IRectangle, TextInfo, Anchor, TextBlock, t_words } from "../utils";

export class Title extends Drawable implements DrawableText {
  fsize: number;
  lheight: number;
  align: string;
  content: string;
  textBlock?: TextBlock | undefined;

  constructor(rect: IRectangle, info: TextInfo, content: string) {
    super(rect);
    this.fsize = info.fsize;
    this.lheight = info.lheight;
    this.align = info.align;
    this.content = content;
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
