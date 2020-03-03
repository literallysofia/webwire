import fs from "fs";
import { Browser } from "./browser";
import { Element, Text, Image, Input, Button } from "./element";
import { WebElement } from "selenium-webdriver";

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
      let xpath = "//" + tag + "[text()]";
      let group = await this.getGroup("text", tag, xpath);
      groups.push(group);
    } else if (tag === "a") {
      let linkPath = "//" + tag + "[not(contains(@class, 'btn'))]";
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
      if (!displayed) break;
      // TODO: problema no display

      var rec = await elem.getRect();

      if (group.type === "text") {
        let lineHeight = parseInt(await elem.getCssValue("line-height"), 10);
        this.data.push(new Text(group.type, rec.height, rec.width, rec.x, rec.y, rec.height / lineHeight));
      } else if (group.type === "image") {
        this.data.push(new Image(group.type, rec.height, rec.width, rec.x, rec.y));
      } else if (group.type === "input") {
        let type = await elem.getAttribute("type");
        this.data.push(new Input(group.type, rec.height, rec.width, rec.x, rec.y, type));
      } else if (group.type === "button") {
        this.data.push(new Button(group.type, rec.height, rec.width, rec.x, rec.y));
      }
    }
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
    console.log(this.data);

    var json = JSON.stringify(content);
    fs.writeFile("data.json", json, function(err) {
      if (err) {
        console.log(err);
      }
    });
  }
}
