import { Drawable, Title, Text, Image, Button, Dropdown, TextField, Radio, Checkbox } from "./drawable";
import { IElement } from "./ielement";
import { Config } from "./config";
import { ElementType, Ellipse, Heading } from "./utils";
import { JsonConvert, OperationMode, ValueCheckingMode } from "json2typescript";
import { JSDOM } from "jsdom";
import xmlserializer from "xmlserializer";
import fs from "fs";
import yaml from "js-yaml";

/* VARIABLES */
const rough = require("roughjs/bundled/rough.cjs.js");
const { document } = new JSDOM(`...`).window;

class Render {
  data: IElement[];
  config: Config;
  canvas: SVGSVGElement;
  roughCanvas: any;
  sizeCanvas = {
    height: 0,
    width: 0
  };

  constructor(data: IElement[], config: Config) {
    this.data = data;
    this.config = config;
    this.config.setFontFamily();
    this.canvas = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    this.createSVGDefs();
    this.roughCanvas = rough.svg(this.canvas, { options: this.config.options });
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
    this.canvas.setAttribute("height", (this.sizeCanvas.height + 30).toString());
    this.canvas.setAttribute("width", (this.sizeCanvas.width + 30).toString());
  }

  draw() {
    for (let e of this.data) {
      var elem: Drawable;

      switch (e.name) {
        case ElementType.Title: {
          elem = new Title(e.height, e.width, e.x, e.y, e.fsize, e.lineHeight, e.align);
          break;
        }
        case ElementType.Text: {
          elem = new Text(e.height, e.width, e.x, e.y, e.nlines);
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

      elem.generate(this.config.randomize, this.config.randomOffset);
      if (elem.lines) this.drawLines(elem.lines);
      if (elem.ellipse) this.drawEllipse(elem.ellipse);
      if (elem.heading) this.drawHeading(elem.heading);

      if (this.sizeCanvas.height < e.height + e.y) this.sizeCanvas.height = e.height + e.y;
      if (this.sizeCanvas.width < e.width + e.x) this.sizeCanvas.width = e.width + e.x;
    }
    this.setCanvasSize();
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

  drawHeading(head: Heading) {
    const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    var svgText = document.createElementNS("http://www.w3.org/2000/svg", "text");
    svgText.setAttribute("x", head.x.toString());
    svgText.setAttribute("y", head.y.toString());
    svgText.setAttribute("font-size", head.size.toString());
    svgText.setAttribute("font-family", this.config.fontFamily);
    svgText.setAttribute("text-anchor", head.anchor);

    var textnode = document.createTextNode(this.config.getTitleText());
    svgText.appendChild(textnode);
    g.appendChild(svgText);
    this.canvas.appendChild(g);
  }

  export() {
    //generates svg file
    var svg = xmlserializer.serializeToString(this.canvas);
    fs.writeFile("wireframe.svg", svg, function(err) {
      if (err) {
        console.log(err);
      }
    });

    //generates html file
    var doc = document.implementation.createHTMLDocument("Wireframe");
    doc.body.appendChild(this.canvas);
    var html = xmlserializer.serializeToString(doc);
    fs.writeFile("wireframe.html", html, function(err) {
      if (err) {
        console.log(err);
      }
    });
  }
}

function renderWireframe() {
  var dataFile = fs.readFileSync("./data.json", "utf8");
  var jsonData = JSON.parse(dataFile);

  var configFile = fs.readFileSync("./config.yml", "utf8");
  var jsonConfig = yaml.safeLoad(configFile);

  var jsonConvert: JsonConvert = new JsonConvert();
  jsonConvert.operationMode = OperationMode.LOGGING;
  jsonConvert.ignorePrimitiveChecks = false; // don't allow assigning number to string etc.
  jsonConvert.valueCheckingMode = ValueCheckingMode.DISALLOW_NULL; // never allow null

  var data: IElement[];
  try {
    data = jsonConvert.deserializeArray(jsonData, IElement);
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
