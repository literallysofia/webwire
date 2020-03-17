import fs from "fs";
import { WebElement, IRectangle } from "selenium-webdriver";
import { Browser } from "./browser";
import { Drawable, Title, Text, Image, Input, Button, Dropdown } from "./drawable";
import { Name } from "./utils";

/* VARIABLES */
const config = require("config-yml");
var titleAlternatives = ["h1", "h2", "h3", "h4", "h5", "h6"];
var textAlternatives = ["p", "small", "label"];
var imageAlternatives = ["img", "svg", "canvas"];
var inputAlternatives = ["input"];
var buttonAlternatives = ["button"];
var dropdownAlternatives = ["select"];
var linkAlternatives = ["a"];

export class Inspector {
  data: Drawable[];
  browser: Browser;

  constructor(b: Browser) {
    this.browser = b;
    this.data = [];
  }

  async fetchData(tag: string): Promise<void> {
    var foundElements;

    if (titleAlternatives.includes(tag)) {
      foundElements = await this.findElements(tag);
      await this.addElements(Name.Title, foundElements);
    } else if (textAlternatives.includes(tag)) {
      let xpath = "//" + tag + "[text() and not(a[contains(@class, 'btn')])]";
      foundElements = await this.findElements(tag, xpath);
      await this.addElements(Name.Text, foundElements);
    } else if (imageAlternatives.includes(tag)) {
      foundElements = await this.findElements(tag);
      await this.addElements(Name.Image, foundElements);
    } else if (inputAlternatives.includes(tag)) {
      foundElements = await this.findElements(tag);
      await this.addElements(Name.Input, foundElements);
    } else if (buttonAlternatives.includes(tag)) {
      foundElements = await this.findElements(tag);
      await this.addElements(Name.Button, foundElements);
    } else if (dropdownAlternatives.includes(tag)) {
      foundElements = await this.findElements(tag);
      await this.addElements(Name.Dropdown, foundElements);
    } else if (linkAlternatives.includes(tag)) {
      let linkPath = "//" + tag + "[not(contains(@class, 'btn')) and not(ancestor::p)]";
      let buttonPath = "//" + tag + "[contains(@class, 'btn')]";
      foundElements = await this.findElements(tag, linkPath);
      await this.addElements(Name.Text, foundElements);
      foundElements = await this.findElements(tag, buttonPath);
      await this.addElements(Name.Button, foundElements);
    }
  }

  async findElements(tag: string, xpath?: string): Promise<WebElement[]> {
    var elems: WebElement[];

    if (xpath) {
      elems = await this.browser.findElements(xpath, true);
    } else {
      elems = await this.browser.findElements(tag, false);
    }

    return elems;
  }

  async addElements(name: Name, elems: WebElement[]): Promise<void> {
    for (let elem of elems) {
      var displayed = await elem.isDisplayed();

      // inputs happen to be hidden most times for customization purposes
      if (displayed || name === Name.Input) {
        var rect = await elem.getRect();

        switch (name) {
          case Name.Title:
            rect = await this.getRectangle(elem);
            this.data.push(this.createTitle(rect.height, rect.width, rect.x, rect.y));
            break;
          case Name.Text:
            rect = await this.getRectangle(elem);
            let lineHeight = parseInt(await elem.getCssValue("line-height"), 10);
            let numLines = Math.round(rect.height / lineHeight);
            this.data.push(this.createText(rect.height, rect.width, rect.x, rect.y, numLines));
            break;
          case Name.Image:
            this.data.push(this.createImage(rect.height, rect.width, rect.x, rect.y));
            break;
          case Name.Input:
            let type = await elem.getAttribute("type");
            this.data.push(this.createInput(rect.height, rect.width, rect.x, rect.y, type));
            break;
          case Name.Button:
            this.data.push(this.createButton(rect.height, rect.width, rect.x, rect.y));
            break;
          case Name.Dropdown:
            this.data.push(this.createDropdown(rect.height, rect.width, rect.x, rect.y));
            break;
        }
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

  createInput(h: number, w: number, x: number, y: number, type: string): Drawable {
    return new Input(h, w, x, y, type);
  }

  createButton(h: number, w: number, x: number, y: number): Drawable {
    return new Button(h, w, x, y);
  }

  createDropdown(h: number, w: number, x: number, y: number): Drawable {
    return new Dropdown(h, w, x, y);
  }

  export() {
    //console.log(this.data);
    var json = JSON.stringify(this.data);
    fs.writeFile("data.json", json, function(err) {
      if (err) {
        console.log(err);
      }
    });
  }
}
