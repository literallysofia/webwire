import { LoremIpsum } from "lorem-ipsum";

export declare type Point = [number, number];
export declare type Line = Point[];

export enum Anchor {
  Start = "start",
  Middle = "middle",
  End = "end",
}

export interface TextLine {
  width: number;
  text: string;
}

export interface IRectangle {
  x: number;
  y: number;
  height: number;
  width: number;
}

export interface Ellipse {
  cx: number;
  cy: number;
  height: number;
  width: number;
}

export interface TextProps {
  align: string;
  content: string;
  fsize: number;
  lheight: number;
}

export interface TextBlock {
  x: number;
  y: number;
  fsize: number;
  lheigth: number;
  anchor: string;
  baseline: string;
  words: string[];
}

export interface Options {
  font?: string;
  textBlock?: string;
  randomOffset?: number;
  keepOriginalText?: boolean;
  roughness?: number;
  bowing?: number;
  strokeWidth?: number;
}

export function random_sentence(): string {
  var lorem = new LoremIpsum({
    wordsPerSentence: {
      max: 15,
      min: 1,
    },
  });
  return lorem.generateSentences(1);
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
