const rough = require("roughjs/bundled/rough.cjs.js");
var data = require("../data.json");

console.log(data.elements);

const options = {
  roughness: 1.5,
  strokeWidth: 1.5
};

class Render {
  data: any;
  canvas: HTMLElement;
  roughCanvas: any;
  canvasHeight: number = 0;

  constructor(data: any) {
    this.data = data;
    this.canvas = document.getElementById("canvas") as HTMLElement;
    this.roughCanvas = rough.svg(this.canvas);
  }

  setCanvasHeight() {
    this.canvas.setAttribute("height", (this.canvasHeight + 30).toString());
  }

  draw() {
    for (let e of this.data.elements) {
      switch (e.tag) {
        case "img": {
          this.drawImage(e);
          break;
        }
        case "button": {
          this.drawButton(e);
          break;
        }
        //case "li":
        case "p": {
          this.drawText(e);
          break;
        }
        default: {
          this.drawDefault(e);
          break;
        }
      }

      if (this.canvasHeight < e.height + e.y)
        this.canvasHeight = e.height + e.y;
    }
    this.setCanvasHeight();
  }

  drawDefault(e: any) {
    let shapeNode = this.roughCanvas.rectangle(
      e.x,
      e.y,
      e.width,
      e.height,
      options
    );
    this.canvas.appendChild(shapeNode);
  }

  drawText(e: any) {
    const g = document.createElementNS("http://www.w3.org/2000/svg", "g");

    for (let i = 0; i < e.lines; i++) {
      // height + lineHeight * i + half of lineHeight to vertical center
      let y = e.y + (e.height / e.lines) * i + e.height / e.lines / 2;

      let line = this.roughCanvas
        .line(e.x, y, e.x + e.width, y, options)
        .getElementsByTagName("path")[0];

      g.appendChild(line);
    }

    this.canvas.appendChild(g);
  }

  drawImage(e: any) {
    let shapeNode = this.roughCanvas.rectangle(
      e.x,
      e.y,
      e.width,
      e.height,
      options
    );
    let firstLine = this.roughCanvas
      .line(e.x, e.y, e.x + e.width, e.y + e.height)
      .getElementsByTagName("path")[0];
    let lastLine = this.roughCanvas
      .line(e.x + e.width, e.y, e.x, e.y + e.height)
      .getElementsByTagName("path")[0];

    shapeNode.appendChild(firstLine);
    shapeNode.appendChild(lastLine);
    this.canvas.appendChild(shapeNode);
  }

  drawButton(e: any) {
    if (e.x <= 0 || e.y <= 0) return;

    let shapeNode = this.roughCanvas.rectangle(
      e.x,
      e.y,
      e.width,
      e.height,
      options
    );

    let points = [];

    for (let i = 0; i * 10 < e.width - 30; i++) {
      let x = 10 * i + e.x + 20;
      let xdeg = (Math.PI / 30) * x;
      let y =
        e.y +
        e.height -
        Math.round((Math.sin(xdeg) * e.height) / 10) -
        e.height / 2;
      points.push([x, y]);
    }
    let curve = this.roughCanvas.curve(points, options);

    shapeNode.appendChild(curve);
    this.canvas.appendChild(shapeNode);
  }
}

const render = new Render(data);
render.draw();
