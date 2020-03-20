export class Config {
  fontFamily: string;
  titles: string[];
  sizeCanvas = {
    height: 0,
    width: 0
  };
  options: object;

  constructor(font: string, t: string[], op: object) {
    this.fontFamily = font;
    this.titles = t;
    this.options = op;
  }

  setCanvasHeight(n: number) {
    this.sizeCanvas.height = n;
  }

  setCanvasWidth(n: number) {
    this.sizeCanvas.width = n;
  }
}

/* const options = {
  roughness: Math.random() + 0.5,
  bowing: Math.random() * 5,
  //strokeWidth: Math.random() * 4 + 1,
  strokeWidth: 1.5,
  hachureGap: Math.random() * 4
}; */
