import { Drawable, Title, Text, Image, Button, Dropdown, TextField, Radio, Checkbox } from "./drawable";
import { Data, IElement } from "./data";
import { Config } from "./config";
import { ElementType, Ellipse } from "./utils";
import { JsonConvert, OperationMode, ValueCheckingMode } from "json2typescript";
import { JSDOM } from "jsdom";
import xmlserializer from "xmlserializer";
import fs from "fs";
import yaml from "js-yaml";

/* VARIABLES */
const rough = require("roughjs/bundled/rough.cjs.js");
const { document } = new JSDOM(`...`).window;

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
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    const style = document.createElementNS("http://www.w3.org/2000/svg", "style");
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
    for (let e of this.data.elements) {
      var elem: Drawable;

      switch (e.name) {
        case ElementType.Title: {
          this.drawTitle(e);
          break;
        }
        case ElementType.Text: {
          elem = new Text(e.height, e.width, e.x, e.y, e.nlines);
          elem.generate(this.config.randomize, this.config.randomOffset);
          if (elem.lines) this.drawLines(elem.lines);
          if (elem.ellipse) this.drawEllipse(elem.ellipse);
          break;
        }
        case ElementType.Image: {
          elem = new Image(e.height, e.width, e.x, e.y);
          elem.generate(this.config.randomize, this.config.randomOffset);
          if (elem.lines) this.drawLines(elem.lines);
          if (elem.ellipse) this.drawEllipse(elem.ellipse);
          break;
        }
        case ElementType.Button: {
          elem = new Button(e.height, e.width, e.x, e.y);
          elem.generate(this.config.randomize, this.config.randomOffset);
          if (elem.lines) this.drawLines(elem.lines);
          if (elem.ellipse) this.drawEllipse(elem.ellipse);
          break;
        }
        case ElementType.TextField: {
          elem = new TextField(e.height, e.width, e.x, e.y);
          elem.generate(this.config.randomize, this.config.randomOffset);
          if (elem.lines) this.drawLines(elem.lines);
          if (elem.ellipse) this.drawEllipse(elem.ellipse);
          break;
        }
        case ElementType.Checkbox: {
          elem = new Checkbox(e.height, e.width, e.x, e.y);
          elem.generate(this.config.randomize, this.config.randomOffset);
          if (elem.lines) this.drawLines(elem.lines);
          if (elem.ellipse) this.drawEllipse(elem.ellipse);
          break;
        }
        case ElementType.Radio: {
          elem = new Radio(e.height, e.width, e.x, e.y);
          elem.generate(this.config.randomize, this.config.randomOffset);
          if (elem.lines) this.drawLines(elem.lines);
          if (elem.ellipse) this.drawEllipse(elem.ellipse);
          break;
        }
        case ElementType.Dropdown: {
          elem = new Dropdown(e.height, e.width, e.x, e.y);
          elem.generate(this.config.randomize, this.config.randomOffset);
          if (elem.lines) this.drawLines(elem.lines);
          if (elem.ellipse) this.drawEllipse(elem.ellipse);
          break;
        }
        default: {
          elem = new TextField(e.height, e.width, e.x, e.y);
          elem.generate(this.config.randomize, this.config.randomOffset);
          if (elem.lines) this.drawLines(elem.lines);
          if (elem.ellipse) this.drawEllipse(elem.ellipse);
          break;
        }
      }
    }
  }

  drawTitle(elem: IElement) {
    var title = new Title(elem.height, elem.width, elem.x, elem.y, elem.fsize, elem.lineHeight, elem.align);
    if (elem.text !== "") title.setText(elem.text);
    title.generate(this.config.randomize, this.config.randomOffset);

    this.createTextSvg(title.x, title.y, title.fsize, title.getAnchor(), title.text);
  }

  createTextSvg(x: number, y: number, fontSize: number, anchor: string, text?: string) {
    const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    var svgText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    svgText.setAttribute("x", x.toString());
    svgText.setAttribute("y", y.toString());
    svgText.setAttribute("font-size", fontSize.toString());
    svgText.setAttribute("font-family", this.config.fontFamily);
    svgText.setAttribute("text-anchor", anchor);

    var textnode;
    if (this.config.keepOriginalText && text) textnode = document.createTextNode(text);
    else textnode = document.createTextNode(this.config.getRandomText());

    svgText.appendChild(textnode);
    g.appendChild(svgText);
    this.canvas.appendChild(g);
  }

  drawLines(lines: number[][][]) {
    const g = document.createElementNS("http://www.w3.org/2000/svg", "g");

    for (let points of lines) {
      let line = this.roughCanvas.curve(points).getElementsByTagName("path")[0];
      g.appendChild(line);
    }

    this.canvas.appendChild(g);
  }

  drawEllipse(ellipse: Ellipse) {
    let shapeNode = this.roughCanvas.ellipse(ellipse.cx, ellipse.cy, ellipse.width, ellipse.height);
    let center = this.roughCanvas
      .ellipse(ellipse.cx, ellipse.cy, ellipse.width / 2, ellipse.height / 2, { fill: "black", fillStyle: "solid" })
      .getElementsByTagName("path")[0];

    shapeNode.appendChild(center);
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
  jsonConvert.operationMode = OperationMode.LOGGING;
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
