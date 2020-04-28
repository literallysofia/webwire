import puppeteer from "puppeteer";

export class Wireframe {
  id: number;
  fpath: string;

  constructor(id: number, fileDir: string) {
    this.id = id;
    this.fpath = "file://" + __dirname + "/../../" + fileDir;
  }

  async capture() {
    let browser = await puppeteer.launch({ headless: true });
    let page = await browser.newPage();
    await page.goto(this.fpath, { waitUntil: "networkidle2" });
    await page.screenshot({
      path: `./generated/wireframes/wireframe_${this.id}.jpg`,
      type: "jpeg",
      fullPage: true,
    });
    await page.close();
    await browser.close();
  }
}
