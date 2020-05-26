import { serializeToString } from "xmlserializer";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import { green } from "colors";
import puppeteer from "puppeteer";

export class Export {
  fileId: number;
  version: number = 1;

  constructor(id: number) {
    this.fileId = id;

    while (
      existsSync(`./generated/images/jpg/wireframe_${this.fileId}_v${this.version}.jpg`) ||
      existsSync(`./generated/images/svg/wireframe_${this.fileId}_v${this.version}.svg`) ||
      existsSync(`./generated/temp/wireframe_${this.fileId}_v${this.version}.html`)
    ) {
      this.version++;
    }
  }

  saveSvg(svg: SVGSVGElement) {
    const dir = "./generated/images/svg";
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

    try {
      const svgStr = serializeToString(svg);
      const svgPath = `${dir}/wireframe_${this.fileId}_v${this.version}.svg`;
      writeFileSync(svgPath, svgStr);
    } catch (e) {
      console.error(<Error>e);
    }
  }

  async saveJpg(html: Document) {
    const dir = "./generated/images/jpg";
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

    try {
      const jpgPath = `${dir}/wireframe_${this.fileId}_v${this.version}.jpg`;
      const htmlStr = serializeToString(html);
      await this.capture(htmlStr, jpgPath);
      console.log(`\n> Wireframe saved at ${green(jpgPath)}\n`);
    } catch (e) {
      console.error(<Error>e);
    }
  }

  async capture(html: string, outFilePath: string) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.setContent(html, { waitUntil: "networkidle0" });
    await page.screenshot({
      path: outFilePath,
      type: "jpeg",
      fullPage: true,
    });
    await page.close();
    await browser.close();
  }
}
