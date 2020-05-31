import { existsSync, mkdirSync, writeFileSync } from "fs";
import { SingleBar } from "cli-progress";
import { green } from "colors";
import { format } from "prettier";
import SVGO from "svgo";
import { Browser } from "./browser";
import { Config } from "./config";
import { WebElement } from "selenium-webdriver";
import { IRectangle, TextProps, Website } from "./utils";
import { IElement, Icon, Text, RealText } from "./ielement";

export class Inspector {
  browser: Browser;
  config: Config;
  website: Website;
  data: IElement[];
  types: string[];
  size = {
    height: 0,
    width: 0,
  };
  nBar: SingleBar;
  fBar: SingleBar;

  constructor(browser: Browser, config: Config, website: Website, bars: SingleBar[]) {
    this.browser = browser;
    this.config = config;
    this.website = website;
    this.data = [];
    this.types = [];
    this.nBar = bars[0];
    this.fBar = bars[1];
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

      if (Object.getOwnPropertyNames(Inspector.prototype).indexOf(`create${type}`) >= 0) await eval(`this.create${type}(elem)`);
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

  async createBurger(elem: WebElement) {
    await this.addElement("Burger", elem);
  }

  async createDropdown(elem: WebElement) {
    await this.addElement("Dropdown", elem);
  }

  async addElement(name: string, elem: WebElement) {
    const rect = await elem.getRect();
    const ielement = new IElement(name, rect);
    this.data.push(ielement);
  }

  async createTitle(elem: WebElement) {
    const rect = await this.rectWithoutPadding(elem);
    await this.createRealText("Title", elem, rect);
  }

  async createLink(elem: WebElement) {
    const rect = await this.rectWithoutPadding(elem);
    await this.createRealText("Link", elem, rect);
  }

  async createButton(elem: WebElement) {
    const rect = await elem.getRect();
    await this.createRealText("Button", elem, rect);
  }

  async createRealText(name: string, elem: WebElement, rect: IRectangle) {
    const fontSize = parseInt(await elem.getCssValue("font-size"), 10);
    const textAlign = await elem.getCssValue("text-align");
    let text = await elem.getText();
    text = text.split("\n")[0];
    if (text === "") text = await elem.getAttribute("value");
    let lineHeight = parseInt(await elem.getCssValue("line-height"), 10);

    if (isNaN(lineHeight)) lineHeight = Math.round(fontSize * 1.2);

    const info: TextProps = {
      align: textAlign,
      content: text,
      fsize: fontSize,
      lheight: lineHeight,
    };

    const ielement = new RealText(name, rect, info);
    this.data.push(ielement);
  }

  async createText(elem: WebElement) {
    const rect = await this.rectWithoutPadding(elem);
    const fontSize = parseInt(await elem.getCssValue("font-size"), 10);
    let lineHeight = parseInt(await elem.getCssValue("line-height"), 10);
    if (isNaN(lineHeight)) lineHeight = fontSize * 1.2;
    let nlines = Math.floor(rect.height / lineHeight);
    if (nlines < 1) nlines = 1;
    this.data.push(new Text("Text", rect, nlines));
  }

  async createIcon(elem: WebElement) {
    const rect = await elem.getRect();
    const svg = await this.browser.getSVG(elem);
    const svgo = new SVGO({
      plugins: [
        { cleanupAttrs: true },
        {
          addAttributesToSVGElement: {
            attributes: [`xmlns="http://www.w3.org/2000/svg"`],
          },
        },
        {
          removeAttrs: {
            attrs: "(stroke|fill|fill-opacity|data-type|fill-rule|class|stroke-linecap|stroke-linejoin|stroke-width|aria-hidden|rx|ry|preserveAspectRatio|aria-label|xmlns)",
          },
        },
      ],
    });
    const optimizedSvg = await svgo.optimize(svg.replace(/<text[^>]*>.*?<\/text>/g, ""));
    this.data.push(new Icon("Icon", rect, optimizedSvg.data));
  }

  async setSize() {
    this.size.height = await this.browser.getDocumentHeight();
    this.size.width = await this.browser.getDocumentWidth();
  }

  async rectWithoutPadding(elem: WebElement): Promise<IRectangle> {
    const rec = await elem.getRect();
    const paddingTop = parseInt(await elem.getCssValue("padding-top"), 10);
    const paddingBottom = parseInt(await elem.getCssValue("padding-bottom"), 10);
    const paddingLeft = parseInt(await elem.getCssValue("padding-left"), 10);
    const paddingRight = parseInt(await elem.getCssValue("padding-right"), 10);
    const borderTop = parseInt(await elem.getCssValue("border-top-width"), 10);
    const borderBottom = parseInt(await elem.getCssValue("border-bottom-width"), 10);
    const borderLeft = parseInt(await elem.getCssValue("border-left-width"), 10);
    const borderRight = parseInt(await elem.getCssValue("border-right-width"), 10);
    const rect: IRectangle = {
      x: rec.x + paddingLeft,
      y: rec.y + paddingTop,
      width: rec.width - paddingLeft - paddingRight + borderLeft + borderRight,
      height: rec.height - paddingTop - paddingBottom + borderTop + borderBottom,
    };
    return rect;
  }

  export() {
    const dir = "./generated/data";
    if (!existsSync(dir)) mkdirSync(dir, { recursive: true });

    let filePath = `${dir}/data_${this.website.id}.json`;
    const json = JSON.stringify({
      id: this.website.id,
      url: this.website.url,
      size: this.size,
      elements: this.data,
    });

    if (existsSync(filePath)) {
      filePath = `${dir}/data_${this.website.id}_new.json`;
    }

    try {
      writeFileSync(filePath, format(json, { parser: "json" }));
      console.log("\n> Data saved at " + green(filePath));
    } catch (e) {
      console.error(<Error>e);
    }
  }
}
