import { writeFile, existsSync, mkdirSync } from "fs";
import { SingleBar } from "cli-progress";
import SVGO from "svgo";
import { Browser } from "./browser";
import { Config } from "./config";
import { WebElement, IRectangle } from "selenium-webdriver";
import { ElementType } from "./utils";
import {
  UIElement,
  Header,
  Footer,
  Container,
  Title,
  Link,
  Text,
  Image,
  Icon,
  Button,
  Burguer,
  Dropdown,
  TextField,
  Radio,
  Checkbox
} from "./uielement";

export class Inspector {
  browser: Browser;
  config: Config;
  data: UIElement[];
  size = {
    height: 0,
    width: 0
  };
  nBar: SingleBar;
  fBar: SingleBar;

  constructor(b: Browser, c: Config, nb: SingleBar, fb: SingleBar) {
    this.browser = b;
    this.config = c;
    this.data = [];
    this.nBar = nb;
    this.fBar = fb;
  }

  async normalize() {
    for (let element of this.config.elements) {
      for (let path of element.paths) {
        let elems = await this.browser.findElements(path);
        await this.browser.setDataType(elems, element.type, this.config.iconMinWidth);
      }
      for (let path of element.ignore) {
        let elems = await this.browser.findElements(path);
        await this.browser.removeDataType(elems);
      }
      this.nBar.increment();
    }
    this.nBar.stop();
  }

  async fetch() {
    const elements = await this.browser.findElements("//*[@data-type]");
    this.fBar.start(elements.length, 0);

    for (let type of Object.values(ElementType)) {
      let xpath = "//*[@data-type='" + type + "']";
      let foundElements = await this.browser.findElements(xpath);
      await this.addElements(foundElements);
      if (foundElements.length > 0) this.fBar.increment(foundElements.length);
    }
    await this.setSize();
    for (let elem of this.data) {
      elem.x += 10;
      elem.y += 10;
    }
    this.fBar.stop();
  }

  async addElements(elems: WebElement[]) {
    for (let elem of elems) {
      let type = await elem.getAttribute("data-type");

      switch (type) {
        case ElementType.Container:
          await this.addContainer(elem);
          break;
        case ElementType.Header:
          await this.addHeader(elem);
          break;
        case ElementType.Footer:
          await this.addFooter(elem);
          break;
        case ElementType.Title:
          await this.addTitle(elem);
          break;
        case ElementType.Link:
          if (this.config.keepOriginalText) await this.addNavLink(elem);
          else await this.addText(elem);
          break;
        case ElementType.Text:
          await this.addText(elem);
          break;
        case ElementType.Image:
          await this.addImage(elem);
          break;
        case ElementType.Icon:
          await this.addIcon(elem);
          break;
        case ElementType.TextField:
          await this.addTextField(elem);
          break;
        case ElementType.Checkbox:
          await this.addCheckbox(elem);
          break;
        case ElementType.Radio:
          await this.addRadio(elem);
          break;
        case ElementType.Button:
          await this.addButton(elem);
          break;
        case ElementType.Burguer:
          await this.addBurguer(elem);
          break;
        case ElementType.Dropdown:
          await this.addDropdown(elem);
          break;
        default:
          await this.addContainer(elem);
          break;
      }
    }
  }

  async addHeader(elem: WebElement) {
    const rect = await elem.getRect();
    if (rect.height === 0 || rect.width === 0) return;
    this.data.push(new Header(rect.height, rect.width, rect.x, rect.y));
  }

  async addFooter(elem: WebElement) {
    const rect = await elem.getRect();
    if (rect.height === 0 || rect.width === 0) return;
    this.data.push(new Footer(rect.height, rect.width, rect.x, rect.y));
  }

  async addContainer(elem: WebElement) {
    const rect = await elem.getRect();
    if (rect.height === 0 || rect.width === 0) return;
    this.data.push(new Container(rect.height, rect.width, rect.x, rect.y));
  }

  async addTitle(elem: WebElement) {
    const rect = await this.getRectangle(elem);
    const fontSize = parseInt(await elem.getCssValue("font-size"), 10);
    const lineHeight = parseInt(await elem.getCssValue("line-height"), 10);
    const textAlign = await elem.getCssValue("text-align");
    let text = "";
    if (this.config.keepOriginalText) text = await elem.getText();

    const title = new Title(rect.height, rect.width, rect.x, rect.y, fontSize, lineHeight, textAlign, text);
    this.data.push(title);
  }

  async addText(elem: WebElement) {
    const rect = await this.getRectangle(elem);
    const lineHeight = parseInt(await elem.getCssValue("line-height"), 10);
    const numLines = Math.round(rect.height / lineHeight);
    this.data.push(new Text(rect.height, rect.width, rect.x, rect.y, numLines));
  }

  async addNavLink(elem: WebElement) {
    const rect = await this.getRectangle(elem);
    const fontSize = parseInt(await elem.getCssValue("font-size"), 10);
    const lineHeight = parseInt(await elem.getCssValue("line-height"), 10);
    const textAlign = await elem.getCssValue("text-align");
    let text = await elem.getText();
    text = text.split("\n")[0];
    this.data.push(new Link(rect.height, rect.width, rect.x, rect.y, fontSize, lineHeight, textAlign, text));
  }

  async addImage(elem: WebElement) {
    const rect = await elem.getRect();
    this.data.push(new Image(rect.height, rect.width, rect.x, rect.y));
  }

  async addIcon(elem: WebElement) {
    const rect = await elem.getRect();
    const svg = await this.browser.getSVG(elem);
    const svgo = new SVGO({
      plugins: [
        { cleanupAttrs: true },
        {
          removeAttrs: {
            attrs:
              "(stroke|fill|fill-opacity|data-type|fill-rule|class|stroke-linecap|stroke-linejoin|stroke-width|aria-hidden|rx|ry)"
          }
        }
      ]
    });
    const optimizedSvg = await svgo.optimize(svg);
    this.data.push(new Icon(rect.height, rect.width, rect.x, rect.y, optimizedSvg.data));
  }

  async addTextField(elem: WebElement) {
    const rect = await elem.getRect();
    this.data.push(new TextField(rect.height, rect.width, rect.x, rect.y));
  }

  async addCheckbox(elem: WebElement) {
    const rect = await elem.getRect();
    this.data.push(new Checkbox(rect.height, rect.width, rect.x, rect.y));
  }

  async addRadio(elem: WebElement) {
    const rect = await elem.getRect();
    this.data.push(new Radio(rect.height, rect.width, rect.x, rect.y));
  }

  async addButton(elem: WebElement) {
    const rect = await elem.getRect();
    const fontSize = parseInt(await elem.getCssValue("font-size"), 10);
    let text = "";
    if (this.config.keepOriginalText) text = await elem.getText();
    this.data.push(new Button(rect.height, rect.width, rect.x, rect.y, fontSize, text));
  }

  async addBurguer(elem: WebElement) {
    const rect = await elem.getRect();
    this.data.push(new Burguer(rect.height, rect.width, rect.x, rect.y));
  }

  async addDropdown(elem: WebElement) {
    const rect = await elem.getRect();
    this.data.push(new Dropdown(rect.height, rect.width, rect.x, rect.y));
  }

  async setSize() {
    const html = this.browser.findElement("html");
    const rect = await html.getRect();
    this.size.height = rect.height + 20;
    this.size.width = rect.width + 20;
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
      height: rec.height - paddingTop - paddingBottom
    };
    return rect;
  }

  export() {
    const dir = "./generated";
    if (!existsSync(dir)) mkdirSync(dir);
    const json = JSON.stringify({
      size: this.size,
      elements: this.data
    });
    writeFile(dir + "/data.json", json, function(err) {
      if (err) {
        console.log(err);
      } else console.log("\n> Data saved with success!");
    });
  }
}
