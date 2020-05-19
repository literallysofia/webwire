import { DrawableText } from "./drawabletext";
import { IRectangle, TextProps, Anchor, t_words } from "../utils";

export class Title extends DrawableText {
  constructor(rect: IRectangle, props: TextProps) {
    super(rect, props);
  }

  generate(randomOffset: number) {
    this.mutateCoords(randomOffset);

    const y = this.y + this.lheight / 2;
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
      y: y,
      fsize: this.fsize,
      lheigth: this.lheight,
      anchor: anchor,
      baseline: "middle",
      words: t_words(this.content),
    };
  }
}
