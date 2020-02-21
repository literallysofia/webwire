const rough = require( 'roughjs/bundled/rough.cjs.js');

let svgCanvas = document.getElementById("canvas") as HTMLElement;
const rc = rough.svg(svgCanvas);
let node = rc.rectangle(10, 10, 200, 200); // x, y, width, height
svgCanvas.appendChild(node);
