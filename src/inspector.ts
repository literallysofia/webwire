import fs from "fs";
import { Browser } from "./browser";
import { Element, Text, Image, Input, Button } from "./element";
import { WebElement, IRectangle } from "selenium-webdriver";

interface GroupElement {
  type: string;
  elements: WebElement[];
}

export class Inspector {
  data: Element[];
  browser: Browser;

  constructor(b: Browser) {
    this.browser = b;
    this.data = [];
  }

  async fetchElements(tag: string): Promise<GroupElement[]> {
    var groups: GroupElement[] = [];

    if (this.isText(tag)) {
      let xpath = "//" + tag + "[text() and not(a[contains(@class, 'btn')])]";
      let group = await this.getGroup("text", tag, xpath);
      groups.push(group);
    } else if (tag === "a") {
      let linkPath = "//" + tag + "[not(contains(@class, 'btn')) and not(ancestor::p)]";
      let buttonPath = "//" + tag + "[contains(@class, 'btn')]";

      let group = await this.getGroup("text", tag, linkPath);
      groups.push(group);
      let group2 = await this.getGroup("button", tag, buttonPath);
      groups.push(group2);
    } else if (this.isImage(tag)) {
      let group = await this.getGroup("image", tag);
      groups.push(group);
    } else if (tag === "input") {
      let group = await this.getGroup("input", tag);
      groups.push(group);
    } else if (tag === "button") {
      let group = await this.getGroup("button", tag);
      groups.push(group);
    }

    return groups;
  }

  async getGroup(type: string, tag: string, xpath?: string): Promise<GroupElement> {
    var elems: WebElement[];

    if (xpath) {
      elems = await this.browser.findElements(xpath, true);
    } else {
      elems = await this.browser.findElements(tag, false);
    }

    var group: GroupElement = {
      type: type,
      elements: elems
    };

    return group;
  }

  async addGroups(groups: GroupElement[]): Promise<void> {
    for (let group of groups) {
      await this.addElements(group);
    }
  }

  async addElements(group: GroupElement): Promise<void> {
    for (let elem of group.elements) {
      var displayed = await elem.isDisplayed();

      if (group.type === "input") {
        await this.addInput(group.type, elem);
      } else if (displayed) {
        if (group.type === "text") {
          await this.addText(group.type, elem);
        } else if (group.type === "image") {
          await this.addImage(group.type, elem);
        } else if (group.type === "button") {
          await this.addButton(group.type, elem);
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

  async addText(type: string, elem: WebElement): Promise<void> {
    let rect = await this.getRectangle(elem);
    let lineHeight = parseInt(await elem.getCssValue("line-height"), 10);
    let numLines = Math.round(rect.height / lineHeight);
    this.data.push(new Text(type, rect.height, rect.width, rect.x, rect.y, numLines));
  }

  async addImage(type: string, elem: WebElement): Promise<void> {
    let rect = await elem.getRect();
    this.data.push(new Image(type, rect.height, rect.width, rect.x, rect.y));
  }

  async addInput(type: string, elem: WebElement): Promise<void> {
    let rect = await elem.getRect();
    let variant = await elem.getAttribute("type");
    this.data.push(new Input(type, rect.height, rect.width, rect.x, rect.y, variant));
  }

  async addButton(type: string, elem: WebElement): Promise<void> {
    let rect = await elem.getRect();
    this.data.push(new Button(type, rect.height, rect.width, rect.x, rect.y));
  }

  isText(tag: string): boolean {
    if (tag === "p" || tag === "h1" || tag === "h2" || tag === "h3" || tag === "h4" || tag === "h5" || tag === "h6") {
      return true;
    } else return false;
  }

  isImage(tag: string): boolean {
    if (tag === "img" || tag === "svg" || tag === "canvas") {
      return true;
    } else return false;
  }

  export() {
    var content = {
      elements: this.data
    };
    //console.log(this.data);

    var json = JSON.stringify(content);
    fs.writeFile("data.json", json, function(err) {
      if (err) {
        console.log(err);
      }
    });
  }
}
