import { Point, IRectangle, random } from "../utils";

export abstract class Drawable {
  x: number;
  y: number;
  height: number;
  width: number;

  constructor(rect: IRectangle) {
    this.x = rect.x;
    this.y = rect.y;
    this.height = rect.height;
    this.width = rect.width;
  }

  rectPoints(x: number, y: number, height: number, width: number): Point[] {
    const p1: Point = [x, y];
    const p2: Point = [x + width, y];
    const p3: Point = [x + width, y + height];
    const p4: Point = [x, y + height];

    return [p1, p2, p3, p4];
  }

  mutatePoints(points: Point[], offset: number, area: number) {
    if (area <= offset * 1000) offset = Math.ceil((area / (offset * 1000)) * offset);

    for (let i in points) {
      const point = points[i];
      point[0] += Math.random() * offset * 2 - offset;
      point[1] += Math.random() * offset * 2 - offset;
    }
  }

  mutateCoords(offset: number) {
    offset = random(0, offset);
    this.x += Math.random() * offset * 2 - offset;
    this.y += Math.random() * offset - offset;
  }

  abstract generate(randomOffset: number): void;
}
