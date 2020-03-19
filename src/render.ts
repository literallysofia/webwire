import { JSDOM } from "jsdom";
import xmlserializer from "xmlserializer";
import fs from "fs";
import sharp from "sharp";
import { Drawable, Title, Text, Image, Button, Dropdown, TextField, Radio, Checkbox } from "./drawable";
import { ElementType, Ellipse } from "./utils";

/* VARIABLES */
const rough = require("roughjs/bundled/rough.cjs.js");
const { document } = new JSDOM(`...`).window;

var data = require("../data.json");
var font = "'Kalam', cursive";

const options = {
  roughness: Math.random() + 0.5,
  bowing: Math.random() * 5,
  //strokeWidth: Math.random() * 4 + 1,
  strokeWidth: 1.5,
  hachureGap: Math.random() * 4
};

class Render {
  data: any;
  canvas: SVGSVGElement;
  roughCanvas: any;
  size = {
    height: 0,
    width: 0
  };

  constructor(data: any) {
    this.data = data;
    //this.canvas = document.getElementById("canvas") as HTMLElement;
    this.canvas = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    const style = document.createElementNS("http://www.w3.org/2000/svg", "style");
    style.setAttribute("type", "text/css");
    var textnode = document.createTextNode(
      "@import url('https://fonts.googleapis.com/css2?family=Kalam:wght@300;400;700&display=swap')"
    );
    style.appendChild(textnode);
    defs.appendChild(style);
    this.canvas.append(defs);
    this.roughCanvas = rough.svg(this.canvas);
  }

  setCanvasSize() {
    this.canvas.setAttribute("height", (this.size.height + 30).toString());
    this.canvas.setAttribute("width", (this.size.width + 30).toString());
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

      if (this.size.height < e.height + e.y) this.size.height = e.height + e.y;
      if (this.size.width < e.width + e.x) this.size.width = e.width + e.x;
    }
    this.setCanvasSize();
  }

  drawLines(lines: number[][][]) {
    const g = document.createElementNS("http://www.w3.org/2000/svg", "g");

    for (let points of lines) {
      let line = this.roughCanvas.curve(points, options).getElementsByTagName("path")[0];
      g.appendChild(line);
    }

    this.canvas.appendChild(g);
  }

  drawEllipse(ellipse: Ellipse) {
    let shapeNode = this.roughCanvas.ellipse(ellipse.cx, ellipse.cy, ellipse.width, ellipse.height, options);
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
    svgText.setAttribute("font-family", font);

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

const render = new Render(data);
render.draw();
render.export();
