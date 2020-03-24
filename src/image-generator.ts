import puppeteer from "puppeteer";

class ImageGenerator {
  fpath: string;

  constructor(fileName: string) {
    this.fpath = "file://" + __dirname + "/../" + fileName;
  }

  async capture() {
    let browser = await puppeteer.launch({ headless: true });
    let page = await browser.newPage();
    await page.goto(this.fpath);
    await page.screenshot({
      path: "./wireframe.jpg",
      type: "jpeg",
      fullPage: true
    });
    await page.close();
    await browser.close();
  }
}

const generator = new ImageGenerator("wireframe.html");
generator.capture();
