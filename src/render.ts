const rough = require("roughjs/bundled/rough.cjs.js");
var data = require("../data.json");

console.log(data.elements);

let svgCanvas = document.getElementById("canvas") as HTMLElement;
const rc = rough.svg(svgCanvas);

var maxHeight = 0;

for (let e of data.elements) {
  let node = rc.rectangle(e.x, e.y, e.width, e.height, { roughness: 1.5 });
  svgCanvas.appendChild(node);

  if (maxHeight < e.height + e.y) maxHeight = e.height + e.y;
}

svgCanvas.setAttribute("height", (maxHeight + 30).toString());
