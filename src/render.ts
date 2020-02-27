const rough = require("roughjs/bundled/rough.cjs.js");
var data = require("../data.json");

console.log(data.elements);

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
        case "a": {
          this.drawButton(e);
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
    let shapeNode = this.roughCanvas.rectangle(e.x, e.y, e.width, e.height, {
      bowing: 2,
      roughness: 1.5,
      strokeWidth: 1.5
    });
    this.canvas.appendChild(shapeNode);
  }

  drawImage(e: any) {
    let shapeNode = this.roughCanvas.rectangle(e.x, e.y, e.width, e.height, {
      bowing: 2,
      roughness: 1.5,
      strokeWidth: 1.5
    });
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

    let shapeNode = this.roughCanvas.rectangle(e.x, e.y, e.width, e.height, {
      bowing: 1.5,
      roughness: 1.5,
      strokeWidth: 1.5
    });

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
    let curve = this.roughCanvas.curve(points, {
      roughness: 1.5,
      strokeWidth: 1.5
    });

    shapeNode.appendChild(curve);
    this.canvas.appendChild(shapeNode);
  }
}

const render = new Render(data);
render.draw();
