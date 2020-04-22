import { writeFile, existsSync, mkdirSync } from "fs";
import xmlserializer from "xmlserializer";
import { SingleBar } from "cli-progress";
import rough from "roughjs";
import { RoughSVG } from "roughjs/bin/svg";
import svgpath from "svgpath";
import { JSDOM } from "jsdom";
import { Data, UIElement } from "./data";
import { Config } from "./config";
import { Line, TextLine, TextInfo, TextBlock, Ellipse, IRectangle, random_sentence } from "./utils";
import { Button } from "./graphics/button";
import { ButtonText } from "./graphics/buttontext";
import { Checkbox } from "./graphics/checkbox";
import { Container } from "./graphics/container";
import { Title } from "./graphics/title";
import { Text } from "./graphics/text";
import { Image } from "./graphics/image";
import { Icon } from "./graphics/icon";
import { Burguer } from "./graphics/burguer";
import { TextField } from "./graphics/textfield";
import { Radio } from "./graphics/radio";
import { Dropdown } from "./graphics/dropdown";

/* VARIABLES */
const { document } = new JSDOM(`...`).window;
const DOMParser = new JSDOM(`...`).window.DOMParser;
const namespaceURI = "http://www.w3.org/2000/svg";

export class Render {
  data: Data;
  config: Config;
  bar: SingleBar;
  canvas: SVGSVGElement;
  roughCanvas: RoughSVG;

  constructor(data: Data, config: Config, bar: SingleBar) {
    this.data = data;
    this.config = config;
    this.config.setFontFamily();
    this.bar = bar;
    this.canvas = this.createSvg();
    this.setCanvasSize();
    this.roughCanvas = rough.svg(this.canvas, { options: this.config.options });
  }

  createSvg(): SVGSVGElement {
    const svg = document.createElementNS(namespaceURI, "svg") as SVGSVGElement;
    const defs = document.createElementNS(namespaceURI, "defs");
    const style = document.createElementNS(namespaceURI, "style");
    style.setAttribute("type", "text/css");

    const fontFamily = this.config.fontFamily.substr(this.config.fontFamily.indexOf("'") + 1, this.config.fontFamily.lastIndexOf("'") - 1);
    const font = fontFamily.split(" ").join("+");

    const importFont = "@import url('https://fonts.googleapis.com/css2?family=" + font + "&display=swap')";
    const textnode = document.createTextNode(importFont);
    style.appendChild(textnode);
    defs.appendChild(style);
    svg.append(defs);
    return svg;
  }

  setCanvasSize() {
    this.canvas.setAttribute("height", (this.data.size.height + 20).toString());
    this.canvas.setAttribute("width", (this.data.size.width + 20).toString());
  }

  private measureWidth(text: string, fsize: number) {
    const context = document.createElement("canvas").getContext("2d") as CanvasRenderingContext2D;
    context.font = fsize + "px Arial";
    return context.measureText(text).width;
  }

  private getTextLines(words: string[], targetWidth: number, fsize: number): TextLine[] {
    let lines: TextLine[] = [];
    let line;

    for (let i = 0, n = words.length; i < n; i++) {
      let lineText: string = (line ? line.text + " " : "") + words[i];
      let lineWidth = this.measureWidth(lineText, fsize);

      if (lineWidth <= targetWidth && line) {
        line.width = lineWidth;
        line.text = lineText;
      } else if (lineWidth <= targetWidth && !line) {
        line = { width: lineWidth, text: lineText };
        lines.push(line);
      } else {
        let width = this.measureWidth(words[i], fsize);
        line = { width: width, text: words[i] };
        lines.push(line);
      }
    }
    return lines;
  }

  async draw() {
    for await (let elem of this.data.elements) {
      elem.x += 10;
      elem.y += 10;

      if (Object.getOwnPropertyNames(Render.prototype).indexOf(`draw${elem.name}`) >= 0) eval(`this.draw${elem.name}(elem)`);
      else
        console.error(
          `\n> ERROR: Method 'draw${elem.name}' does not exist.\nPlease fix the type name '${elem.name}' in the configuration file as instructed or create a new method.`
        );
      this.bar.increment();
    }
    this.bar.stop();
  }

  drawHeader(elem: UIElement) {
    this.drawContainer(elem);
  }

  drawFooter(elem: UIElement) {
    this.drawContainer(elem);
  }

  drawContainer(elem: UIElement) {
    const rect: IRectangle = { x: elem.x, y: elem.y, height: elem.height, width: elem.width };
    const c = new Container(rect);
    c.generate(this.config.randomOffset);
    if (c.lines) this.createLines(c.lines);
  }

  drawTitle(elem: UIElement) {
    let content: string;
    if (elem.content) content = elem.content;
    else content = random_sentence();

    const rect: IRectangle = { x: elem.x, y: elem.y, height: elem.height, width: elem.width };
    const info: TextInfo = { fsize: elem.fsize, lheight: elem.lheight, align: elem.align };

    const title = new Title(rect, info, content);
    title.generate(this.config.randomOffset);

    if (title.textBlock) {
      let lines = this.getTextLines(title.textBlock.words, title.width, title.fsize);
      while (lines.length > title.height / title.lheight) {
        lines.pop();
      }
      this.createText(title.textBlock, lines);
    }
  }

  drawText(elem: UIElement) {
    /* let text;
    if (elem.nlines > 1) text = new Paragraph(elem.height, elem.width, elem.x, elem.y);
    else text = new Text(elem.height, elem.width, elem.x, elem.y, elem.nlines); */
    const rect: IRectangle = { x: elem.x, y: elem.y, height: elem.height, width: elem.width };
    const text = new Text(rect, elem.nlines);
    text.generate(this.config.randomOffset);
    if (text.lines) this.createLines(text.lines);
  }

  drawLink(elem: UIElement) {
    if (elem.content) {
      const rect: IRectangle = { x: elem.x, y: elem.y, height: elem.height, width: elem.width };
      const info: TextInfo = { fsize: elem.fsize, lheight: elem.lheight, align: elem.align };
      const link = new Title(rect, info, elem.content);
      link.generate(this.config.randomOffset);
      if (link.textBlock) this.createText(link.textBlock);
    }
  }

  drawImage(elem: UIElement) {
    const rect: IRectangle = { x: elem.x, y: elem.y, height: elem.height, width: elem.width };
    const image = new Image(rect);
    image.generate(this.config.randomOffset);
    if (image.lines) this.createLines(image.lines);
  }

  async drawIcon(elem: UIElement) {
    const rect: IRectangle = { x: elem.x, y: elem.y, height: elem.height, width: elem.width };
    const icon = new Icon(rect, elem.svg);
    await icon.generate();
    const parser = new DOMParser();
    const doc = parser.parseFromString(icon.svg, "image/svg+xml");
    const svg = doc.firstChild as SVGSVGElement;
    this.createIcon(svg, rect);
  }

  drawButton(elem: UIElement) {
    const rect: IRectangle = { x: elem.x, y: elem.y, height: elem.height, width: elem.width };

    if (elem.content) {
      const btn = new ButtonText(rect, elem.fsize, elem.content);
      btn.generate(this.config.randomOffset);
      if (btn.lines) this.createLines(btn.lines);
      if (btn.textBlock) this.createText(btn.textBlock);
    } else {
      const btn = new Button(rect);
      btn.generate(this.config.randomOffset);
      if (btn.lines) this.createLines(btn.lines);
    }
  }

  drawBurguer(elem: UIElement) {
    const rect: IRectangle = { x: elem.x, y: elem.y, height: elem.height, width: elem.width };
    const burguer = new Burguer(rect);
    burguer.generate(this.config.randomOffset);
    if (burguer.lines) this.createLines(burguer.lines);
  }

  drawTextField(elem: UIElement) {
    const rect: IRectangle = { x: elem.x, y: elem.y, height: elem.height, width: elem.width };
    const field = new TextField(rect);
    field.generate(this.config.randomOffset);
    if (field.lines) this.createLines(field.lines);
  }

  drawCheckbox(elem: UIElement) {
    const rect: IRectangle = { x: elem.x, y: elem.y, height: elem.height, width: elem.width };
    const cbox = new Checkbox(rect);
    cbox.generate(this.config.randomOffset);
    if (cbox.lines) this.createLines(cbox.lines);
  }

  drawRadio(elem: UIElement) {
    const rect: IRectangle = { x: elem.x, y: elem.y, height: elem.height, width: elem.width };
    const radio = new Radio(rect);
    radio.generate(this.config.randomOffset);
    if (radio.ellipse) this.createEllipse(radio.ellipse, true);
  }

  drawDropdown(elem: UIElement) {
    const rect: IRectangle = { x: elem.x, y: elem.y, height: elem.height, width: elem.width };
    const drop = new Dropdown(rect);
    drop.generate(this.config.randomOffset);
    if (drop.lines) this.createLines(drop.lines);
  }

  createText(tb: TextBlock, lines?: TextLine[]) {
    const g = document.createElementNS(namespaceURI, "g");
    const text = document.createElementNS(namespaceURI, "text");
    text.setAttribute("x", tb.x.toString());
    text.setAttribute("y", tb.y.toString());
    text.setAttribute("font-size", tb.fsize.toString());
    text.setAttribute("font-family", this.config.fontFamily);
    text.setAttribute("text-anchor", tb.anchor);

    if (lines) {
      for (let line of lines) {
        const tspan = document.createElementNS(namespaceURI, "tspan");
        tspan.setAttribute("x", tb.x.toString());
        tspan.setAttribute("dy", tb.lheigth.toString());
        tspan.textContent = line.text;
        text.appendChild(tspan);
      }
    } else {
      const tspan = document.createElementNS(namespaceURI, "tspan");
      tspan.setAttribute("x", tb.x.toString());
      tspan.setAttribute("dy", tb.lheigth.toString());
      tspan.textContent = tb.words.join(" ");
      text.appendChild(tspan);
    }

    g.appendChild(text);
    this.canvas.appendChild(g);
  }

  createLines(lines: Line[]) {
    const g = document.createElementNS(namespaceURI, "g");
    for (let points of lines) {
      let line = this.roughCanvas.curve(points).getElementsByTagName("path")[0];
      g.appendChild(line);
    }
    this.canvas.appendChild(g);
  }

  createEllipse(ellipse: Ellipse, dot: boolean) {
    const shapeNode = this.roughCanvas.ellipse(ellipse.cx, ellipse.cy, ellipse.width, ellipse.height);
    if (dot) {
      const center = this.roughCanvas.ellipse(ellipse.cx, ellipse.cy, ellipse.width / 2, ellipse.height / 2, { fill: "black", fillStyle: "solid" }).getElementsByTagName("path")[0];
      shapeNode.appendChild(center);
    }
    this.canvas.appendChild(shapeNode);
  }

  createIcon(svg: SVGSVGElement, rect: IRectangle) {
    let drawnPaths = [];
    for (let i = 0; i < svg.children.length; i++) {
      const path = svg.children[i].getAttribute("d");
      if (path) {
        const svgPath = svgpath(path)
          .abs()
          .round(1)
          .toString();

        drawnPaths.push(
          this.roughCanvas
            .path(svgPath, {
              roughness: 0.3,
              bowing: 2,
            })
            .getElementsByTagName("path")[0]
        );
      }
    }

    svg.setAttribute("x", rect.x.toString());
    svg.setAttribute("y", rect.y.toString());
    svg.setAttribute("height", rect.height.toString());
    svg.setAttribute("width", rect.width.toString());
    svg.setAttribute("overflow", "visible");
    svg.innerHTML = "";
    drawnPaths.forEach((path) => {
      path.setAttribute("vector-effect", "non-scaling-stroke");
      svg.appendChild(path);
    });
    this.canvas.appendChild(svg);
  }

  export() {
    const dir = "./generated";
    if (!existsSync(dir)) mkdirSync(dir);

    //generates svg file
    const svg = xmlserializer.serializeToString(this.canvas);
    writeFile(dir + "/wireframe.svg", svg, function(err) {
      if (err) {
        console.log(err);
      }
    });

    //generates html file
    const doc = document.implementation.createHTMLDocument("Wireframe");
    doc.body.appendChild(this.canvas);
    const html = xmlserializer.serializeToString(doc);
    writeFile(dir + "/wireframe.html", html, function(err) {
      if (err) {
        console.log(err);
      }
    });
  }
}
