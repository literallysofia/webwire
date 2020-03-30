import { Title, Text, Image, Button, Dropdown, TextField, Radio, Checkbox } from "./drawable";
import { Data, IElement } from "./data";
import { Config } from "./config";
import { ElementType, Paragraph, TextBlock } from "./utils";
import { JsonConvert, OperationMode, ValueCheckingMode } from "json2typescript";
import { JSDOM } from "jsdom";
import xmlserializer from "xmlserializer";
import fs from "fs";
import yaml from "js-yaml";

/* VARIABLES */
const rough = require("roughjs/bundled/rough.cjs.js");
const { document } = new JSDOM(`...`).window;
var namespaceURI = "http://www.w3.org/2000/svg";

class Render {
  data: Data;
  config: Config;
  canvas: SVGSVGElement;
  roughCanvas: any;

  constructor(data: Data, config: Config) {
    this.data = data;
    this.config = config;
    this.config.setFontFamily();
    this.canvas = this.createSvg();
    this.setCanvasSize();
    this.roughCanvas = rough.svg(this.canvas, { options: this.config.options });
  }

  createSvg(): SVGSVGElement {
    const svg = document.createElementNS(namespaceURI, "svg") as SVGSVGElement;
    const defs = document.createElementNS(namespaceURI, "defs");
    const style = document.createElementNS(namespaceURI, "style");
    style.setAttribute("type", "text/css");

    var fontFamily = this.config.fontFamily.substr(
      this.config.fontFamily.indexOf("'") + 1,
      this.config.fontFamily.lastIndexOf("'") - 1
    );
    var font = fontFamily.split(" ").join("+");

    var importFont = "@import url('https://fonts.googleapis.com/css2?family=" + font + "&display=swap')";
    var textnode = document.createTextNode(importFont);
    style.appendChild(textnode);
    defs.appendChild(style);
    svg.append(defs);
    return svg;
  }

  setCanvasSize() {
    this.canvas.setAttribute("height", (this.data.size.height + 10).toString());
    this.canvas.setAttribute("width", (this.data.size.width + 10).toString());
  }

  draw() {
    for (let elem of this.data.elements) {
      switch (elem.name) {
        case ElementType.Title: {
          this.drawTitle(elem);
          break;
        }
        case ElementType.Text: {
          this.drawText(elem);
          break;
        }
        case ElementType.Image: {
          this.drawImage(elem);
          break;
        }
        case ElementType.Button: {
          this.drawButton(elem);
          break;
        }
        case ElementType.TextField: {
          this.drawTextField(elem);
          break;
        }
        case ElementType.Checkbox: {
          this.drawCheckbox(elem);
          break;
        }
        case ElementType.Radio: {
          this.drawRadio(elem);
          break;
        }
        case ElementType.Dropdown: {
          this.drawDropdown(elem);
          break;
        }
      }
    }
  }

  measureWidth(text: string, fsize: number) {
    const context = document.createElement("canvas").getContext("2d") as CanvasRenderingContext2D;
    context.font = fsize + "px Arial";
    return context.measureText(text).width;
  }

  getTextLines(words: string[], targetWidth: number, fsize: number): Paragraph[] {
    var lines: Paragraph[] = [];
    var line;

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

  drawTitle(elem: IElement) {
    var title = new Title(elem.height, elem.width, elem.x, elem.y, elem.fsize, elem.lineHeight, elem.align, elem.text);
    if (!this.config.keepOriginalText) title.setTextRandom(this.config.getRandomSentence());
    title.generate(this.config.randomize, this.config.randomOffset);

    if (title.textBlock) {
      var lines = this.getTextLines(title.textBlock.words, title.width, title.fsize);
      while (lines.length > title.height / title.lineHeight) {
        lines.pop();
      }
      this.createText(title.textBlock, lines);
    }
  }

  drawText(elem: IElement) {
    var text = new Text(elem.height, elem.width, elem.x, elem.y, elem.nlines);
    text.generate(this.config.randomize, this.config.randomOffset);
    if (text.lines) this.createLines(text.lines);
  }

  drawImage(elem: IElement) {
    var image = new Image(elem.height, elem.width, elem.x, elem.y);
    image.generate(this.config.randomize, this.config.randomOffset);
    if (image.lines) this.createLines(image.lines);
  }

  drawButton(elem: IElement) {
    var btn = new Button(elem.height, elem.width, elem.x, elem.y);
    btn.generate(this.config.randomize, this.config.randomOffset);
    if (btn.lines) this.createLines(btn.lines);
  }

  drawTextField(elem: IElement) {
    var tfield = new TextField(elem.height, elem.width, elem.x, elem.y);
    tfield.generate(this.config.randomize, this.config.randomOffset);
    if (tfield.lines) this.createLines(tfield.lines);
  }

  drawCheckbox(elem: IElement) {
    var cbox = new Checkbox(elem.height, elem.width, elem.x, elem.y);
    cbox.generate(this.config.randomize, this.config.randomOffset);
    if (cbox.lines) this.createLines(cbox.lines);
  }

  drawRadio(elem: IElement) {
    var radio = new Radio(elem.height, elem.width, elem.x, elem.y);
    radio.generate(this.config.randomize, this.config.randomOffset);
    if (radio.ellipse)
      this.createEllipse(radio.ellipse.cx, radio.ellipse.cy, radio.ellipse.width, radio.ellipse.height, true);
  }

  drawDropdown(elem: IElement) {
    var drop = new Dropdown(elem.height, elem.width, elem.x, elem.y);
    drop.generate(this.config.randomize, this.config.randomOffset);
    if (drop.lines) this.createLines(drop.lines);
  }

  createText(tb: TextBlock, lines: Paragraph[]) {
    const g = document.createElementNS(namespaceURI, "g");
    const text = document.createElementNS(namespaceURI, "text");
    text.setAttribute("x", tb.x);
    text.setAttribute("y", tb.y);
    text.setAttribute("font-size", tb.fontSize);
    text.setAttribute("font-family", this.config.fontFamily);
    text.setAttribute("text-anchor", tb.anchor);

    for (let line of lines) {
      const tspan = document.createElementNS(namespaceURI, "tspan");
      tspan.setAttribute("x", tb.x);
      tspan.setAttribute("dy", tb.lineHeight);
      tspan.textContent = line.text;
      text.appendChild(tspan);
    }

    g.appendChild(text);
    this.canvas.appendChild(g);
  }

  createLines(lines: number[][][]) {
    const g = document.createElementNS(namespaceURI, "g");

    for (let points of lines) {
      let line = this.roughCanvas.curve(points).getElementsByTagName("path")[0];
      g.appendChild(line);
    }

    this.canvas.appendChild(g);
  }

  createEllipse(cx: number, cy: number, width: number, height: number, dot: boolean) {
    var shapeNode = this.roughCanvas.ellipse(cx, cy, width, height);
    if (dot) {
      var center = this.roughCanvas
        .ellipse(cx, cy, width / 2, height / 2, { fill: "black", fillStyle: "solid" })
        .getElementsByTagName("path")[0];
      shapeNode.appendChild(center);
    }
    this.canvas.appendChild(shapeNode);
  }

  export() {
    //generates svg file
    var svg = xmlserializer.serializeToString(this.canvas);
    fs.writeFile("./generated/wireframe.svg", svg, function(err) {
      if (err) {
        console.log(err);
      }
    });

    //generates html file
    var doc = document.implementation.createHTMLDocument("Wireframe");
    doc.body.appendChild(this.canvas);
    var html = xmlserializer.serializeToString(doc);
    fs.writeFile("./generated/wireframe.html", html, function(err) {
      if (err) {
        console.log(err);
      }
    });
  }
}

function renderWireframe() {
  var dataFile = fs.readFileSync("./generated/data.json", "utf8");
  var jsonData = JSON.parse(dataFile);

  var configFile = fs.readFileSync("./config.yml", "utf8");
  var jsonConfig = yaml.safeLoad(configFile);

  var jsonConvert: JsonConvert = new JsonConvert();
  //jsonConvert.operationMode = OperationMode.LOGGING;
  jsonConvert.ignorePrimitiveChecks = false; // don't allow assigning number to string etc.
  jsonConvert.valueCheckingMode = ValueCheckingMode.DISALLOW_NULL; // never allow null

  var data: Data;
  try {
    data = jsonConvert.deserializeObject(jsonData, Data);
    var config: Config;
    try {
      config = jsonConvert.deserializeObject(jsonConfig, Config);
      const render = new Render(data, config);
      render.draw();
      render.export();
    } catch (e) {
      console.log(<Error>e);
    }
  } catch (e) {
    console.log(<Error>e);
  }
}

renderWireframe();
