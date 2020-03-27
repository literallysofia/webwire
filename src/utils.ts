export enum ElementType {
  Title = "title",
  Text = "text",
  Image = "image",
  TextField = "text-field",
  Checkbox = "checkbox",
  Radio = "radio",
  Button = "button",
  Dropdown = "dropdown"
}

export enum Anchor {
  Start = "start",
  Middle = "middle",
  End = "end"
}

export interface Ellipse {
  cx: number;
  cy: number;
  height: number;
  width: number;
}

export interface Paragraph {
  width: number;
  text: string;
}

export class TextBlock {
  static _id: number = 0;
  id: number;
  x: string;
  y: string;
  height: string;
  width: string;
  fontSize: string;
  lineHeight: string;
  anchor: string;
  cx: string;
  words: string[];

  constructor(
    x: number,
    y: number,
    h: number,
    w: number,
    fsize: number,
    lheight: number,
    a: string,
    cx: number,
    words: string[]
  ) {
    this.id = TextBlock._id++;
    this.x = x.toString();
    this.y = y.toString();
    this.height = h.toString();
    this.width = w.toString();
    this.fontSize = fsize.toString();
    this.lineHeight = lheight.toString();
    this.anchor = a;
    this.cx = cx.toString();
    this.words = words;
  }
}

export function random(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export function p_mult(a: number[], v: number) {
  a[0] *= v;
  a[1] *= v;
  return a;
}

export function p_sum(a: number[], b: number[]) {
  return [a[0] + b[0], a[1] + b[1]];
}

export function p_sub(a: number[], b: number[]) {
  return [a[0] - b[0], a[1] - b[1]];
}

export function p_lerp(a: number[], b: number[], t: number) {
  return p_sum(a, p_mult(p_sub(b, a), t));
}

export function p_trans(a: number[], xd: number, yd: number) {
  return [a[0] + xd, a[1] + yd];
}
