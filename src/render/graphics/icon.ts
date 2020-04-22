import { Drawable } from "./drawable";
import { IRectangle } from "../utils";
import SVGO from "svgo";

export class Icon extends Drawable {
  svg: string;

  constructor(rect: IRectangle, svg: string) {
    super(rect);
    this.svg = svg;
  }

  async generate() {
    const svgo = new SVGO({
      plugins: [{ convertShapeToPath: { convertArcs: true } }, { convertPathData: true }, { mergePaths: true }],
    });
    const optimizedSvg = await svgo.optimize(this.svg);
    this.svg = optimizedSvg.data;
  }
}
