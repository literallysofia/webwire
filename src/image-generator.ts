import puppeteer from "puppeteer";

class ImageGenerator {
  fpath: string;

  constructor(fileName: string) {
    this.fpath = "file://" + __dirname + "/../generated/" + fileName;
  }

  async capture() {
    let browser = await puppeteer.launch({ headless: true });
    let page = await browser.newPage();
    await page.goto(this.fpath, { waitUntil: "networkidle2" });
    await page.screenshot({
      path: "./generated/wireframe.jpg",
      type: "jpeg",
      fullPage: true,
    });
    await page.close();
    await browser.close();
  }
}

const generator = new ImageGenerator("wireframe.html");
generator.capture();
