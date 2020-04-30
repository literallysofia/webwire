import { serializeToString } from "xmlserializer";
import { existsSync, mkdirSync, writeFileSync } from "fs";
import { green, red } from "colors";
import puppeteer from "puppeteer";

export class Export {
  fileId: number;

  constructor(id: number) {
    this.fileId = id;
  }

  saveSvg(svg: SVGSVGElement) {
    const dir = "./generated/images/svg";
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

    try {
      const svgStr = serializeToString(svg);
      const svgPath = `${dir}/wireframe_${this.fileId}.svg`;
      writeFileSync(svgPath, svgStr);
    } catch (e) {
      console.error(<Error>e);
    }
  }

  saveHtml(html: Document): string | undefined {
    const dir = "./generated/temp";
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

    try {
      const htmlStr = serializeToString(html);
      const htmlPath = `${dir}/wireframe_${this.fileId}.html`;
      writeFileSync(htmlPath, htmlStr);
      return htmlPath;
    } catch (e) {
      console.error(<Error>e);
    }
  }

  async saveJpg(htmlPath: string | undefined) {
    if (htmlPath) {
      const dir = "./generated/images/jpg";
      if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

      try {
        const jpgPath = `${dir}/wireframe_${this.fileId}.jpg`;
        const htmlRelPath = `file://${__dirname}/../..${htmlPath.substr(1)}`;
        await this.capture(htmlRelPath, jpgPath);
        console.log("\n> Wireframe saved at " + green(jpgPath));
      } catch (e) {
        console.error(<Error>e);
      }
    } else console.error(red("\n ERROR: ") + "Wireframe JPG was not generated because HTML file is missing.");
  }

  async capture(inFilePath: string, outFilePath: string) {
    const browser = await puppeteer.launch({ headless: true });
    const page = await browser.newPage();
    await page.goto(inFilePath, { waitUntil: "networkidle2" });
    await page.screenshot({
      path: outFilePath,
      type: "jpeg",
      fullPage: true,
    });
    await page.close();
    await browser.close();
  }
}
