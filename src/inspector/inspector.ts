import { writeFile, existsSync, mkdirSync } from "fs";
import { SingleBar } from "cli-progress";
import SVGO from "svgo";
import { Browser } from "./browser";
import { Config } from "./config";
import { WebElement } from "selenium-webdriver";
import { IRectangle } from "./utils";
import { IElement, Header, Footer, Container, Title, Link, Text, Image, Icon, Button, Burguer, Dropdown, TextField, Radio, Checkbox } from "./ielement";

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
      if (Object.getOwnPropertyNames(Inspector.prototype).indexOf(`add${type}`) >= 0) eval(`this.add${type}(elem)`);
      else console.error(`\n> ERROR: Method 'add${type}' does not exist.\nPlease fix the type name '${type}' in the configuration file as instructed or create a new method.`);
    }
  }

  async addHeader(elem: WebElement) {
    const rect = await elem.getRect();
    this.data.push(new Header(rect));
  }

  async addFooter(elem: WebElement) {
    const rect = await elem.getRect();
    this.data.push(new Footer(rect));
  }

  async addContainer(elem: WebElement) {
    const rect = await elem.getRect();
    this.data.push(new Container(rect));
  }

  async addTitle(elem: WebElement) {
    const rect = await this.getRectangle(elem);
    const fontSize = parseInt(await elem.getCssValue("font-size"), 10);
    let lineHeight = parseInt(await elem.getCssValue("line-height"), 10);
    const textAlign = await elem.getCssValue("text-align");

    if (isNaN(lineHeight)) lineHeight = Math.round(fontSize * 1.2);

    const title = new Title(rect, fontSize, lineHeight, textAlign);
    if (this.config.keepOriginalText) {
      const text = await elem.getText();
      title.setContent(text);
    }
    this.data.push(title);
  }

  async addLink(elem: WebElement) {
    if (!this.config.keepOriginalText) {
      this.addText(elem);
      return;
    }

    const rect = await this.getRectangle(elem);
    const fontSize = parseInt(await elem.getCssValue("font-size"), 10);
    let lineHeight = parseInt(await elem.getCssValue("line-height"), 10);
    const textAlign = await elem.getCssValue("text-align");

    if (isNaN(lineHeight)) lineHeight = Math.round(fontSize * 1.2);

    const link = new Link(rect, fontSize, lineHeight, textAlign);
    let text = await elem.getText();
    text = text.split("\n")[0];
    link.setContent(text);

    this.data.push(link);
  }

  async addText(elem: WebElement) {
    const rect = await this.getRectangle(elem);
    const fontSize = parseInt(await elem.getCssValue("font-size"), 10);
    let lineHeight = parseInt(await elem.getCssValue("line-height"), 10);
    if (isNaN(lineHeight)) lineHeight = fontSize * 1.2;
    const nlines = Math.round(rect.height / lineHeight);
    this.data.push(new Text(rect, nlines));
  }

  async addImage(elem: WebElement) {
    const rect = await elem.getRect();
    this.data.push(new Image(rect));
  }

  async addIcon(elem: WebElement) {
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
    this.data.push(new Icon(rect, optimizedSvg.data));
  }

  async addTextField(elem: WebElement) {
    const rect = await elem.getRect();
    this.data.push(new TextField(rect));
  }

  async addCheckbox(elem: WebElement) {
    const rect = await elem.getRect();
    this.data.push(new Checkbox(rect));
  }

  async addRadio(elem: WebElement) {
    const rect = await elem.getRect();
    this.data.push(new Radio(rect));
  }

  async addButton(elem: WebElement) {
    const rect = await elem.getRect();

    const btn = new Button(rect);
    if (this.config.keepOriginalText) {
      const text = await elem.getText();
      const fontSize = parseInt(await elem.getCssValue("font-size"), 10);
      btn.setContent(text, fontSize);
    }
    this.data.push(btn);
  }

  async addBurguer(elem: WebElement) {
    const rect = await elem.getRect();
    this.data.push(new Burguer(rect));
  }

  async addDropdown(elem: WebElement) {
    const rect = await elem.getRect();
    this.data.push(new Dropdown(rect));
  }

  async setSize() {
    const html = this.browser.findElement("html");
    const rect = await html.getRect();
    this.size.height = rect.height;
    this.size.width = rect.width;
  }

  async getRectangle(elem: WebElement): Promise<IRectangle> {
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
    const dir = "./generated";
    if (!existsSync(dir)) mkdirSync(dir);
    const json = JSON.stringify({
      size: this.size,
      elements: this.data,
    });
    writeFile(dir + "/data.json", json, function(err) {
      if (err) {
        console.error(err);
      } else console.log("\n> Data saved with success!");
    });
  }
}
