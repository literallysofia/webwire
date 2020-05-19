import { Drawable } from "./drawable";
import { IRectangle, TextProps, TextBlock } from "../utils";

export abstract class DrawableText extends Drawable {
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
}
