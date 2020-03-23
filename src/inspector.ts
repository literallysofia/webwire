import { WebElement, IRectangle } from "selenium-webdriver";
import { Browser } from "./browser";
import { Drawable, Title, Text, Image, TextField, Radio, Checkbox, Button, Dropdown } from "./drawable";
import { ElementType } from "./utils";
import { Config } from "./config";
import fs from "fs";

export class Inspector {
  browser: Browser;
  config: Config;
  data: Drawable[];

  constructor(b: Browser, c: Config) {
    this.browser = b;
    this.config = c;
    this.data = [];
  }

  async normalize(): Promise<void> {
    for (let element of this.config.elements) {
      for (let path of element.paths) {
        let elems = await this.browser.findElements(path);
        await this.browser.setDataType(elems, element.type);
      }
      for (let path of element.ignore) {
        let elems = await this.browser.findElements(path);
        this.browser.removeDataType(elems);
      }
    }
  }

  async fetchData(): Promise<void> {
    var foundElements;

    for (let type of Object.values(ElementType)) {
      var xpath = "//*[@data-type='" + type + "']";
      foundElements = await this.browser.findElements(xpath);
      await this.addElements(foundElements);
    }
  }

  async addElements(elems: WebElement[]): Promise<void> {
    for (let elem of elems) {
      var type = await elem.getAttribute("data-type");
      var rect = await elem.getRect();

      switch (type) {
        case ElementType.Title:
          rect = await this.getRectangle(elem);
          var textAlign = await elem.getCssValue("text-align");
          this.data.push(this.createTitle(rect.height, rect.width, rect.x, rect.y, textAlign));
          break;
        case ElementType.Text:
          rect = await this.getRectangle(elem);
          let lineHeight = parseInt(await elem.getCssValue("line-height"), 10);
          let numLines = Math.round(rect.height / lineHeight);
          this.data.push(this.createText(rect.height, rect.width, rect.x, rect.y, numLines));
          break;
        case ElementType.Image:
          this.data.push(this.createImage(rect.height, rect.width, rect.x, rect.y));
          break;
        case ElementType.TextField:
          this.data.push(this.createTextField(rect.height, rect.width, rect.x, rect.y));
          break;
        case ElementType.Checkbox:
          this.data.push(this.createCheckbox(rect.height, rect.width, rect.x, rect.y));
          break;
        case ElementType.Radio:
          this.data.push(this.createRadio(rect.height, rect.width, rect.x, rect.y));
          break;
        case ElementType.Button:
          this.data.push(this.createButton(rect.height, rect.width, rect.x, rect.y));
          break;
        case ElementType.Dropdown:
          this.data.push(this.createDropdown(rect.height, rect.width, rect.x, rect.y));
          break;
      }
    }
  }

  async getRectangle(elem: WebElement): Promise<IRectangle> {
    var rec = await elem.getRect();

    let paddingTop = parseInt(await elem.getCssValue("padding-top"), 10);
    let paddingBottom = parseInt(await elem.getCssValue("padding-bottom"), 10);
    let paddingLeft = parseInt(await elem.getCssValue("padding-left"), 10);
    let paddingRight = parseInt(await elem.getCssValue("padding-right"), 10);

    let rect: IRectangle = {
      x: rec.x,
      y: rec.y,
      width: rec.width - paddingLeft - paddingRight,
      height: rec.height - paddingTop - paddingBottom
    };

    return rect;
  }

  createTitle(h: number, w: number, x: number, y: number, align: string): Drawable {
    return new Title(h, w, x, y, align);
  }

  createText(h: number, w: number, x: number, y: number, nlines: number): Drawable {
    return new Text(h, w, x, y, nlines);
  }

  createImage(h: number, w: number, x: number, y: number): Drawable {
    return new Image(h, w, x, y);
  }

  createTextField(h: number, w: number, x: number, y: number): Drawable {
    return new TextField(h, w, x, y);
  }

  createCheckbox(h: number, w: number, x: number, y: number): Drawable {
    return new Checkbox(h, w, x, y);
  }

  createRadio(h: number, w: number, x: number, y: number): Drawable {
    return new Radio(h, w, x, y);
  }

  createButton(h: number, w: number, x: number, y: number): Drawable {
    return new Button(h, w, x, y);
  }

  createDropdown(h: number, w: number, x: number, y: number): Drawable {
    return new Dropdown(h, w, x, y);
  }

  export() {
    var json = JSON.stringify(this.data);
    fs.writeFile("data.json", json, function(err) {
      if (err) {
        console.log(err);
      }
    });
  }
}
