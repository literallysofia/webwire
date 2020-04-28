import { existsSync, mkdirSync, writeFileSync } from "fs";
import { SingleBar } from "cli-progress";
import { green } from "colors";
import SVGO from "svgo";
import { Browser } from "./browser";
import { Config } from "./config";
import { WebElement } from "selenium-webdriver";
import { IRectangle } from "./utils";
import { IElement, Button, Icon, Text, RealText } from "./ielement";

export class Inspector {
  browser: Browser;
  config: Config;
  data: IElement[];
  types: string[];
  size = {
    height: 0,
    width: 0,
  };
  nBar: SingleBar;
  fBar: SingleBar;

  constructor(browser: Browser, config: Config, nbar: SingleBar, fbar: SingleBar) {
    this.browser = browser;
    this.config = config;
    this.data = [];
    this.types = [];
    this.nBar = nbar;
    this.fBar = fbar;
  }

  async normalize() {
    await this.browser.setSVGDimensions();

    for (let element of this.config.elements) {
      for (let path of element.paths) {
        let elems = await this.browser.findElements(path);
        await this.browser.setDataType(elems, element.type, element.css);
      }
      for (let path of element.ignore) {
        let elems = await this.browser.findElements(path);
        await this.browser.removeDataType(elems);
      }
      this.types.push(element.type);
      this.nBar.increment();
    }
    this.nBar.stop();
  }

  async fetch() {
    const elements = await this.browser.findElements("//*[@data-type]");
    this.fBar.start(elements.length, 0);

    for (let type of this.types) {
      let xpath = "//*[@data-type='" + type + "']";
      let foundElements = await this.browser.findElements(xpath);
      await this.addElements(foundElements);
      if (foundElements.length > 0) this.fBar.increment(foundElements.length);
    }
    await this.setSize();
    this.fBar.stop();
  }

  async addElements(elems: WebElement[]) {
    for await (let elem of elems) {
      let type = await elem.getAttribute("data-type");
      if (Object.getOwnPropertyNames(Inspector.prototype).indexOf(`create${type}`) >= 0) eval(`this.create${type}(elem)`);
      else console.error(`\n> ERROR: Method 'create${type}' does not exist.\nPlease fix the type name '${type}' in the configuration file as instructed or create a new method.`);
    }
  }

  async createHeader(elem: WebElement) {
    await this.addElement("Header", elem);
  }

  async createFooter(elem: WebElement) {
    await this.addElement("Footer", elem);
  }

  async createContainer(elem: WebElement) {
    await this.addElement("Container", elem);
  }

  async createImage(elem: WebElement) {
    await this.addElement("Image", elem);
  }

  async createTextField(elem: WebElement) {
    await this.addElement("TextField", elem);
  }

  async createCheckbox(elem: WebElement) {
    await this.addElement("Checkbox", elem);
  }

  async createRadio(elem: WebElement) {
    await this.addElement("Radio", elem);
  }

  async createBurguer(elem: WebElement) {
    await this.addElement("Burguer", elem);
  }

  async createDropdown(elem: WebElement) {
    await this.addElement("Dropdown", elem);
  }

  async createButton(elem: WebElement) {
    if (this.config.keepOriginalText) {
      const rect = await elem.getRect();
      const text = await elem.getText();
      const fontSize = parseInt(await elem.getCssValue("font-size"), 10);
      const btn = new Button("Button", rect, text, fontSize);
      this.data.push(btn);
    } else this.addElement("Button", elem);
  }

  async addElement(name: string, elem: WebElement) {
    const rect = await elem.getRect();
    this.data.push(new IElement(name, rect));
  }

  async createTitle(elem: WebElement) {
    const rect = await this.rectWithoutPadding(elem);
    const fontSize = parseInt(await elem.getCssValue("font-size"), 10);
    let lineHeight = parseInt(await elem.getCssValue("line-height"), 10);
    const textAlign = await elem.getCssValue("text-align");

    if (isNaN(lineHeight)) lineHeight = Math.round(fontSize * 1.2);

    const title = new RealText("Title", rect, fontSize, lineHeight, textAlign);
    if (this.config.keepOriginalText) {
      const text = await elem.getText();
      title.setContent(text);
    }
    this.data.push(title);
  }

  async createLink(elem: WebElement) {
    if (!this.config.keepOriginalText) {
      this.createText(elem);
      return;
    }

    const rect = await this.rectWithoutPadding(elem);
    const fontSize = parseInt(await elem.getCssValue("font-size"), 10);
    let lineHeight = parseInt(await elem.getCssValue("line-height"), 10);
    const textAlign = await elem.getCssValue("text-align");

    if (isNaN(lineHeight)) lineHeight = Math.round(fontSize * 1.2);

    const link = new RealText("Link", rect, fontSize, lineHeight, textAlign);
    let text = await elem.getText();
    text = text.split("\n")[0];
    link.setContent(text);

    this.data.push(link);
  }

  async createText(elem: WebElement) {
    const rect = await this.rectWithoutPadding(elem);
    const fontSize = parseInt(await elem.getCssValue("font-size"), 10);
    let lineHeight = parseInt(await elem.getCssValue("line-height"), 10);
    if (isNaN(lineHeight)) lineHeight = fontSize * 1.2;
    const nlines = Math.round(rect.height / lineHeight);
    this.data.push(new Text("Text", rect, nlines));
  }

  async createIcon(elem: WebElement) {
    const rect = await elem.getRect();
    const svg = await this.browser.getSVG(elem);
    const svgo = new SVGO({
      plugins: [
        { cleanupAttrs: true },
        {
          removeAttrs: {
            attrs: "(stroke|fill|fill-opacity|data-type|fill-rule|class|stroke-linecap|stroke-linejoin|stroke-width|aria-hidden|rx|ry)",
          },
        },
      ],
    });
    const optimizedSvg = await svgo.optimize(svg);
    this.data.push(new Icon("Icon", rect, optimizedSvg.data));
  }

  async setSize() {
    const html = this.browser.findElement("html");
    const rect = await html.getRect();
    this.size.height = rect.height;
    this.size.width = rect.width;
  }

  async rectWithoutPadding(elem: WebElement): Promise<IRectangle> {
    const rec = await elem.getRect();
    const paddingTop = parseInt(await elem.getCssValue("padding-top"), 10);
    const paddingBottom = parseInt(await elem.getCssValue("padding-bottom"), 10);
    const paddingLeft = parseInt(await elem.getCssValue("padding-left"), 10);
    const paddingRight = parseInt(await elem.getCssValue("padding-right"), 10);
    const rect: IRectangle = {
      x: rec.x,
      y: rec.y,
      width: rec.width - paddingLeft - paddingRight,
      height: rec.height - paddingTop - paddingBottom,
    };
    return rect;
  }

  export() {
    const dir = "./generated/data";
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

    let id = 1;
    let filePath = `${dir}/data_${id}.json`;

    while (existsSync(filePath)) {
      id++;
      filePath = `${dir}/data_${id}.json`;
    }

    const json = JSON.stringify({
      id: id,
      size: this.size,
      elements: this.data,
    });

    try {
      writeFileSync(filePath, json);
      console.log("\n> Data saved at " + green(filePath));
    } catch (e) {
      console.error(<Error>e);
    }
  }
}
