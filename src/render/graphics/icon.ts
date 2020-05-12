import { Drawable } from "./drawable";
import { IRectangle } from "../utils";
import { serializeToString } from "xmlserializer";
import SVGO from "svgo";

export class Icon extends Drawable {
  svg: string;
  parser: DOMParser;

  constructor(rect: IRectangle, svg: string, parser: DOMParser) {
    super(rect);
    this.svg = svg;
    this.parser = parser;
  }

  getSvg(): SVGSVGElement {
    const doc = this.parser.parseFromString(this.svg, "image/svg+xml");
    return doc.firstChild as SVGSVGElement;
  }

  removePercentage(svg: SVGSVGElement): SVGSVGElement {
    for (let i = 0; i < svg.children.length; i++) {
      const shape = svg.children[i];
      this.percentToNumber(shape, "x", this.width);
      this.percentToNumber(shape, "y", this.height);
      this.percentToNumber(shape, "height", this.height);
      this.percentToNumber(shape, "width", this.width);
    }
    return svg;
  }

  private percentToNumber(elem: Element, attr: string, total: number) {
    const value = elem.getAttribute(attr);
    if (value && value.indexOf("%") > -1) {
      const newValue = (total * parseInt(value)) / 100;
      elem.setAttribute(attr, newValue.toString());
    }
  }

  async generate() {
    this.svg = serializeToString(this.removePercentage(this.getSvg()));

    const svgo = new SVGO({
      plugins: [{ convertShapeToPath: { convertArcs: true } }, { convertPathData: true }, { mergePaths: true }],
    });
    const optimizedSvg = await svgo.optimize(this.svg);
    this.svg = optimizedSvg.data;
  }
}
