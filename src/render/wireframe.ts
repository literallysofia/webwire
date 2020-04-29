import puppeteer from "puppeteer";
import { existsSync, mkdirSync } from "fs";

export class Wireframe {
  inFilePath: string;
  outFilePath: string;

  constructor(id: number, fileDir: string) {
    this.inFilePath = `file://${__dirname}/../..${fileDir}`;
    const dir = "./generated/images";
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });
    this.outFilePath = `${dir}/wireframe_${id}.jpg`;
  }

  async capture() {
    let browser = await puppeteer.launch({ headless: true });
    let page = await browser.newPage();
    await page.goto(this.inFilePath, { waitUntil: "networkidle2" });
    await page.screenshot({
      path: this.outFilePath,
      type: "jpeg",
      fullPage: true,
    });
    await page.close();
    await browser.close();
  }
}
