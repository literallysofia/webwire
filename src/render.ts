import { Drawable, Title, Text, Image, Button, Dropdown, TextField, Radio, Checkbox } from "./drawable";
import { IElement } from "./ielement";
import { Config } from "./config";
import { ElementType, Ellipse } from "./utils";
import { JsonConvert, ValueCheckingMode } from "json2typescript";
import { JSDOM } from "jsdom";
import xmlserializer from "xmlserializer";
import fs from "fs";
import yaml from "js-yaml";
//import sharp from "sharp";

/* VARIABLES */
const rough = require("roughjs/bundled/rough.cjs.js");
const { document } = new JSDOM(`...`).window;

class Render {
  data: IElement[];
  canvas: SVGSVGElement;
  roughCanvas: any;
  config: Config;

  constructor(data: IElement[]) {
    this.data = data;

    var file = fs.readFileSync("./config.yml", "utf8");
    var renderConfigs = yaml.safeLoad(file).render;
    var fontIndex = Math.floor(Math.random() * Math.floor(renderConfigs.fonts.length - 1));
    this.config = new Config(renderConfigs.fonts[fontIndex], renderConfigs.titles, renderConfigs.options);

    this.canvas = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    this.createSVGDefs();

    this.roughCanvas = rough.svg(this.canvas);
  }

  createSVGDefs() {
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
    this.canvas.append(defs);
  }

  setCanvasSize() {
    this.canvas.setAttribute("height", (this.config.sizeCanvas.height + 30).toString());
    this.canvas.setAttribute("width", (this.config.sizeCanvas.width + 30).toString());
  }

  draw() {
    for (let e of this.data) {
      var elem: Drawable;

      switch (e.name) {
        case ElementType.Title: {
          elem = new Title(e.height, e.width, e.x, e.y);
          break;
        }
        case ElementType.Text: {
          elem = new Text(e.height, e.width, e.x, e.y, e.nLines);
          break;
        }
        case ElementType.Image: {
          elem = new Image(e.height, e.width, e.x, e.y);
          break;
        }
        case ElementType.Button: {
          elem = new Button(e.height, e.width, e.x, e.y);
          break;
        }
        case ElementType.TextField: {
          elem = new TextField(e.height, e.width, e.x, e.y);
          break;
        }
        case ElementType.Checkbox: {
          elem = new Checkbox(e.height, e.width, e.x, e.y);
          break;
        }
        case ElementType.Radio: {
          elem = new Radio(e.height, e.width, e.x, e.y);
          break;
        }
        case ElementType.Dropdown: {
          elem = new Dropdown(e.height, e.width, e.x, e.y);
          break;
        }
        default: {
          elem = new TextField(e.height, e.width, e.x, e.y);
          break;
        }
      }

      elem.generate();
      if (elem.lines) this.drawLines(elem.lines);
      if (elem.ellipse) this.drawEllipse(elem.ellipse);
      if (!elem.lines && !elem.ellipse) this.drawText(elem);

      if (this.config.sizeCanvas.height < e.height + e.y) this.config.setCanvasHeight(e.height + e.y);
      if (this.config.sizeCanvas.width < e.width + e.x) this.config.setCanvasWidth(e.width + e.x);
    }
    this.setCanvasSize();
  }

  drawLines(lines: number[][][]) {
    const g = document.createElementNS("http://www.w3.org/2000/svg", "g");

    for (let points of lines) {
      let line = this.roughCanvas.curve(points, this.config.options).getElementsByTagName("path")[0];
      g.appendChild(line);
    }

    this.canvas.appendChild(g);
  }

  drawEllipse(ellipse: Ellipse) {
    let shapeNode = this.roughCanvas.ellipse(ellipse.cx, ellipse.cy, ellipse.width, ellipse.height, this.config.options);
    let center = this.roughCanvas
      .ellipse(ellipse.cx, ellipse.cy, ellipse.width / 2, ellipse.height / 2, { fill: "black", fillStyle: "solid" })
      .getElementsByTagName("path")[0];

    shapeNode.appendChild(center);
    this.canvas.appendChild(shapeNode);
  }

  drawText(elem: Drawable) {
    const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    var svgText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    svgText.setAttribute("x", elem.x.toString());
    svgText.setAttribute("y", elem.y.toString());
    svgText.setAttribute("font-size", elem.height.toString());
    svgText.setAttribute("font-family", this.config.fontFamily);

    var textnode = document.createTextNode("Title");
    svgText.appendChild(textnode);
    g.appendChild(svgText);
    this.canvas.appendChild(g);
  }

  export() {
    var svg = xmlserializer.serializeToString(this.canvas);
    fs.writeFile("wireframe.svg", svg, function(err) {
      if (err) {
        console.log(err);
      }
    });
    /*     const buf = Buffer.from(svg);

    sharp(buf)
      .flatten({ background: { r: 255, g: 255, b: 255 } })
      .png()
      .toFile("test.png")
      .then(function(info: any) {
        console.log(info);
      })
      .catch(function(err: any) {
        console.log(err);
      }); */
  }
}

function renderWireframe() {
  var file = fs.readFileSync("./data.json", "utf8");
  var jsonObject = JSON.parse(file);

  var jsonConvert: JsonConvert = new JsonConvert();
  //jsonConvert.operationMode = OperationMode.LOGGING;
  jsonConvert.ignorePrimitiveChecks = false; // don't allow assigning number to string etc.
  jsonConvert.valueCheckingMode = ValueCheckingMode.DISALLOW_NULL; // never allow null

  var data: IElement[];
  try {
    data = jsonConvert.deserializeArray(jsonObject, IElement);
    const render = new Render(data);
    render.draw();
    render.export();
  } catch (e) {
    console.log(<Error>e);
  }
}

renderWireframe();
