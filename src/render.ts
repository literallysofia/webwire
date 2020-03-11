import { Name } from "./utils";
import { Drawable, Text, Image, Input, Button, Dropdown } from "./drawable";
const rough = require("roughjs/bundled/rough.cjs.js");
var data = require("../data.json");

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
        /*         case "button": {
          this.drawButton(e);
          break;
        } */
        case Name.Input: {
          elem = new Input(e.height, e.width, e.x, e.y, e.type);
          break;
        }
        case Name.Dropdown: {
          elem = new Dropdown(e.height, e.width, e.x, e.y);
          break;
        }
        default: {
          elem = new Input(e.height, e.width, e.x, e.y, e.type);
          break;
        }
      }

      elem.generate();
      if (elem.lines) this.drawLines(elem.lines);

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

  //TODO
  drawButton(e: any) {
    if (e.x <= 0 || e.y <= 0) return;

    let shapeNode = this.roughCanvas.rectangle(e.x, e.y, e.width, e.height, options);

    let points = [];

    for (let i = 0; i * 10 < e.width - 30; i++) {
      let x = 10 * i + e.x + 20;
      let xdeg = (Math.PI / 8) * x;
      let y = (Math.sin(xdeg) * e.height) / 10 + (e.y + e.height / 2);
      points.push([x, y]);
    }
    let curve = this.roughCanvas.curve(points, options);

    shapeNode.appendChild(curve);
    this.canvas.appendChild(shapeNode);
  }

  //TODO
  drawInput(e: Input) {
    /* if (e.type === "text" || e.type === "password" || e.type === "email" || e.type === "search" || e.type === "url")
      this.drawDefault(e);
    else */ if (
      e.type === "checkbox"
    ) {
      let shapeNode = this.roughCanvas.rectangle(e.x, e.y, e.width, e.height, options);

      let d = "M" + (e.x + e.width / 4) + " " + (e.y + e.height / 4) + "l7.1 7.2 10.7-16.8";
      let checkmark = this.roughCanvas
        .path(d, {
          strokeWidth: 2
        })
        .getElementsByTagName("path")[0];

      shapeNode.appendChild(checkmark);
      this.canvas.appendChild(shapeNode);
    } else if (e.type === "radio") {
      let x = e.x + e.width / 2;
      let y = e.y + e.height / 2;
      let shapeNode = this.roughCanvas.ellipse(x, y, e.width, e.height, options);
      let point = this.roughCanvas
        .ellipse(x, y, e.width / 2, e.height / 2, { fill: "black", fillStyle: "solid" })
        .getElementsByTagName("path")[0];

      shapeNode.appendChild(point);
      this.canvas.appendChild(shapeNode);
    }
  }
}

const render = new Render(data);
render.draw();
