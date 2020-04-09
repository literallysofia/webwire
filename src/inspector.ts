import { WebElement, IRectangle } from "selenium-webdriver";
import { Browser } from "./browser";
import {
  Drawable,
  Header,
  Footer,
  Title,
  Text,
  NavLink,
  Image,
  Icon,
  TextField,
  Radio,
  Checkbox,
  Button,
  Burguer,
  Dropdown,
} from "./drawable";
import { ElementType } from "./utils";
import { Config } from "./config";
import SVGO from "svgo";
import fs from "fs";
import cliProgress, { SingleBar } from "cli-progress";
import colors from "colors";

export class Inspector {
  browser: Browser;
  config: Config;
  data: Drawable[];
  size = {
    height: 0,
    width: 0,
  };
  nBar: SingleBar;
  fBar: SingleBar;

  constructor(b: Browser, c: Config) {
    this.browser = b;
    this.config = c;
    this.data = [];
    this.nBar = new SingleBar(
      {
        format:
          "Page Normalization |" +
          colors.cyan("{bar}") +
          "| {percentage}% || {value}/{total} Web Elements || ETA: {eta}s",
      },
      cliProgress.Presets.shades_classic
    );
    this.fBar = new SingleBar(
      {
        format:
          "Element Extraction |" +
          colors.magenta("{bar}") +
          "| {percentage}% || {value}/{total} Web Elements || ETA: {eta}s",
      },
      cliProgress.Presets.shades_classic
    );
    this.nBar.start(this.config.elements.length, 0);
  }

  async normalize(): Promise<void> {
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

  async fetch(): Promise<void> {
    var allElem = await this.browser.findElements("//*[@data-type]");
    this.fBar.start(allElem.length, 0);

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

  async addElements(elems: WebElement[]): Promise<void> {
    for (let elem of elems) {
      var type = await elem.getAttribute("data-type");

      switch (type) {
        case ElementType.Header:
          await this.addHeader(elem);
          break;
        case ElementType.Footer:
          await this.addFooter(elem);
          break;
        case ElementType.Title:
          await this.addTitle(elem);
          break;
        case ElementType.Text:
          await this.addText(elem);
          break;
        case ElementType.NavLink:
          if (this.config.keepOriginalText) await this.addNavLink(elem);
          else await this.addText(elem);
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
      }
    }
  }

  async addHeader(elem: WebElement): Promise<void> {
    var rect = await elem.getRect();
    if (rect.height === 0 || rect.width === 0) return;
    this.data.push(new Header(rect.height, rect.width, rect.x, rect.y));
  }

  async addFooter(elem: WebElement): Promise<void> {
    var rect = await elem.getRect();
    this.data.push(new Footer(rect.height, rect.width, rect.x, rect.y));
  }

  async addTitle(elem: WebElement): Promise<void> {
    var rect = await this.getRectangle(elem);
    var fontSize = parseInt(await elem.getCssValue("font-size"), 10);
    var lineHeight = parseInt(await elem.getCssValue("line-height"), 10);
    var textAlign = await elem.getCssValue("text-align");
    var text = "";
    if (this.config.keepOriginalText) text = await elem.getText();

    var title = new Title(rect.height, rect.width, rect.x, rect.y, fontSize, lineHeight, textAlign, text);
    this.data.push(title);
  }

  async addText(elem: WebElement): Promise<void> {
    var rect = await this.getRectangle(elem);
    var lineHeight = parseInt(await elem.getCssValue("line-height"), 10);
    var numLines = Math.round(rect.height / lineHeight);
    this.data.push(new Text(rect.height, rect.width, rect.x, rect.y, numLines));
  }

  async addNavLink(elem: WebElement): Promise<void> {
    var rect = await this.getRectangle(elem);
    var fontSize = parseInt(await elem.getCssValue("font-size"), 10);
    var lineHeight = parseInt(await elem.getCssValue("line-height"), 10);
    var textAlign = await elem.getCssValue("text-align");
    var text = await elem.getText();
    text = text.split("\n")[0];
    this.data.push(new NavLink(rect.height, rect.width, rect.x, rect.y, fontSize, lineHeight, textAlign, text));
  }

  async addImage(elem: WebElement): Promise<void> {
    var rect = await elem.getRect();
    this.data.push(new Image(rect.height, rect.width, rect.x, rect.y));
  }

  async addIcon(elem: WebElement): Promise<void> {
    var rect = await elem.getRect();
    var svg = await this.browser.getSVG(elem);
    var svgo = new SVGO({
      plugins: [
        { cleanupAttrs: true },
        {
          removeAttrs: {
            attrs:
              "(stroke|fill|fill-opacity|data-type|fill-rule|class|stroke-linecap|stroke-linejoin|stroke-width|aria-hidden|rx|ry)",
          },
        },
      ],
    });
    var optimizedSvg = await svgo.optimize(svg);
    this.data.push(new Icon(rect.height, rect.width, rect.x, rect.y, optimizedSvg.data));
  }

  async addTextField(elem: WebElement): Promise<void> {
    var rect = await elem.getRect();
    this.data.push(new TextField(rect.height, rect.width, rect.x, rect.y));
  }

  async addCheckbox(elem: WebElement): Promise<void> {
    var rect = await elem.getRect();
    this.data.push(new Checkbox(rect.height, rect.width, rect.x, rect.y));
  }

  async addRadio(elem: WebElement): Promise<void> {
    var rect = await elem.getRect();
    this.data.push(new Radio(rect.height, rect.width, rect.x, rect.y));
  }

  async addButton(elem: WebElement): Promise<void> {
    var rect = await elem.getRect();
    var fontSize = parseInt(await elem.getCssValue("font-size"), 10);
    var text = "";
    if (this.config.keepOriginalText) text = await elem.getText();
    this.data.push(new Button(rect.height, rect.width, rect.x, rect.y, fontSize, text));
  }

  async addBurguer(elem: WebElement): Promise<void> {
    var rect = await elem.getRect();
    this.data.push(new Burguer(rect.height, rect.width, rect.x, rect.y));
  }

  async addDropdown(elem: WebElement): Promise<void> {
    var rect = await elem.getRect();
    this.data.push(new Dropdown(rect.height, rect.width, rect.x, rect.y));
  }

  async setSize(): Promise<void> {
    var html = this.browser.findElement("html");
    var rect = await html.getRect();
    this.size.height = rect.height + 20;
    this.size.width = rect.width + 20;
  }

  async getRectangle(elem: WebElement): Promise<IRectangle> {
    var rec = await elem.getRect();
    var paddingTop = parseInt(await elem.getCssValue("padding-top"), 10);
    var paddingBottom = parseInt(await elem.getCssValue("padding-bottom"), 10);
    var paddingLeft = parseInt(await elem.getCssValue("padding-left"), 10);
    var paddingRight = parseInt(await elem.getCssValue("padding-right"), 10);
    var rect: IRectangle = {
      x: rec.x,
      y: rec.y,
      width: rec.width - paddingLeft - paddingRight,
      height: rec.height - paddingTop - paddingBottom,
    };
    return rect;
  }

  export() {
    var dir = "./generated";
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
    var json = JSON.stringify({
      size: this.size,
      elements: this.data,
    });
    fs.writeFile(dir + "/data.json", json, function(err) {
      if (err) {
        console.log(err);
      } else console.log("\n> Data saved with success!");
    });
  }
}
