export enum ElementType {
  Header = "header",
  Footer = "footer",
  Title = "title",
  Text = "text",
  NavLink = "nav-link",
  Image = "image",
  Icon = "icon",
  TextField = "text-field",
  Checkbox = "checkbox",
  Radio = "radio",
  Button = "button",
  Burguer = "burguer",
  Dropdown = "dropdown",
}

export declare type Point = [number, number];
export declare type Line = Point[];

export enum Anchor {
  Start = "start",
  Middle = "middle",
  End = "end",
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
  x: string;
  y: string;
  fontSize: string;
  lineHeight: string;
  anchor: string;
  words: string[];

  constructor(x: number, y: number, fsize: number, lheight: number, a: string, words: string[]) {
    this.x = x.toString();
    this.y = y.toString();
    this.fontSize = fsize.toString();
    this.lineHeight = lheight.toString();
    this.anchor = a;
    this.words = words;
  }
}

export function t_words(text: string): string[] {
  const words = text.split(/\s+/g);
  if (!words[words.length - 1]) words.pop();
  if (!words[0]) words.shift();
  return words;
}

export function random(min: number, max: number) {
  return Math.random() * (max - min) + min;
}

export function p_mult(a: Point, v: number) {
  a[0] *= v;
  a[1] *= v;
  return a;
}

export function p_sum(a: Point, b: Point): Point {
  return [a[0] + b[0], a[1] + b[1]];
}

export function p_sub(a: Point, b: Point): Point {
  return [a[0] - b[0], a[1] - b[1]];
}

export function p_lerp(a: Point, b: Point, t: number): Point {
  return p_sum(a, p_mult(p_sub(b, a), t));
}

export function p_trans(a: Point, xd: number, yd: number): Point {
  return [a[0] + xd, a[1] + yd];
}
