import fs from "fs";
import yaml from "js-yaml";
import { WebElement, IRectangle } from "selenium-webdriver";
import { Browser } from "./browser";
import { Drawable, Title, Text, Image, TextField, Radio, Checkbox, Button, Dropdown } from "./drawable";
import { ElementType, Element } from "./utils";

export class Inspector {
  data: Drawable[];
  browser: Browser;
  elements: Element[];

  constructor(b: Browser) {
    this.browser = b;
    this.data = [];
    this.elements = [];
    var file = fs.readFileSync("./config.yml", "utf8");
    var config = yaml.safeLoad(file);

    for (let obj of config.elements) {
      let e = new Element(obj.element.type, obj.element.paths, obj.element.ignore ? obj.element.ignore : null);
      this.elements.push(e);
    }
  }

  async normalize(): Promise<void> {
    for (let element of this.elements) {
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
          this.data.push(this.createTitle(rect.height, rect.width, rect.x, rect.y));
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

  createTitle(h: number, w: number, x: number, y: number): Drawable {
    return new Title(h, w, x, y);
  }

  createText(h: number, w: number, x: number, y: number, lines: number): Drawable {
    return new Text(h, w, x, y, lines);
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
