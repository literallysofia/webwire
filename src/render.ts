import { Name, Ellipse } from "./utils";
import { Drawable, Text, Image, Button, Dropdown, Input, Radio, Checkbox } from "./drawable";
const rough = require("roughjs/bundled/rough.cjs.js");
var data = require("../data.json");
var textField = ["text", "password", "email", "search", "url"];

console.log(data);

const options = {
  roughness: Math.random() + 0.5,
  bowing: Math.random() * 5,
  //strokeWidth: Math.random() * 4 + 1,
  strokeWidth: 1.5,
  hachureGap: Math.random() * 4
};

class Render {
  data: any;
  canvas: HTMLElement;
  roughCanvas: any;
  size = {
    height: 0,
    width: 0
  };

  constructor(data: any) {
    this.data = data;
    this.canvas = document.getElementById("canvas") as HTMLElement;
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
        case Name.Text: {
          elem = new Text(e.height, e.width, e.x, e.y, e.nLines);
          break;
        }
        case Name.Image: {
          elem = new Image(e.height, e.width, e.x, e.y);
          break;
        }
        case Name.Button: {
          elem = new Button(e.height, e.width, e.x, e.y);
          break;
        }
        case Name.Input: {
          if (e.type === "radio") elem = new Radio(e.height, e.width, e.x, e.y, e.type);
          else if (e.type === "checkbox") elem = new Checkbox(e.height, e.width, e.x, e.y, e.type);
          else elem = new Input(e.height, e.width, e.x, e.y, e.type);
          break;
        }
        case Name.Dropdown: {
          elem = new Dropdown(e.height, e.width, e.x, e.y);
          break;
        }
        default: {
          elem = new Input(e.height, e.width, e.x, e.y, "none");
          break;
        }
      }

      elem.generate();
      if (elem.lines) this.drawLines(elem.lines);
      if (elem.ellipse) this.drawEllipse(elem.ellipse);

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
}

const render = new Render(data);
render.draw();
