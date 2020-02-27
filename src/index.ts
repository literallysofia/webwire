import "chromedriver";
import fs from "fs";
import {
  Builder,
  ThenableWebDriver,
  WebElement,
  By,
  WebElementPromise
} from "selenium-webdriver";

const commandLineArgs = require("command-line-args");

const website = commandLineArgs([
  { name: "url", alias: "u", type: String },
  {
    name: "tags",
    alias: "t",
    type: String,
    multiple: true,
    defaultOption: true
  }
]);

class Browser {
  private driver: ThenableWebDriver;

  public constructor(browserName: string) {
    this.driver = new Builder().forBrowser(browserName).build();
  }

  public async navigate(url: string): Promise<void> {
    await this.driver.get(url);
    await this.driver
      .manage()
      .window()
      .maximize();
  }

  public findElement(selector: string): WebElementPromise {
    return this.driver.findElement(By.css(selector));
  }

  public async findElements(selector: string): Promise<WebElement[]> {
    return this.driver.findElements(By.css(selector));
  }

  public async clearCookies(url?: string): Promise<void> {
    if (url) {
      const currentUrl = await this.driver.getCurrentUrl();
      await this.navigate(url);
      await this.driver.manage().deleteAllCookies();
      await this.navigate(currentUrl);
    } else {
      await this.driver.manage().deleteAllCookies();
    }
  }

  public async close(): Promise<void> {
    await this.driver.quit();
  }
}

interface Element {
  tag: string;
  height: number;
  width: number;
  x: number;
  y: number;
  lines?: number;
  type?: string;
}

const browser = new Browser("chrome");
let data = {
  elements: [] as Element[]
};

async function getElementList(): Promise<Element[]> {
  var elements: Element[] = [];

  for (let tag of website.tags) {
    let elems = await browser.findElements(tag);

    for (let elem of elems) {
      let displayed = await elem.isDisplayed();

      let rec = await elem.getRect();
      let tag = await elem.getTagName();

      console.log(tag, " : ", displayed);

      let e: Element = {
        tag: tag,
        height: rec.height,
        width: rec.width,
        x: rec.x,
        y: rec.y
      };

      if (tag === "input") {
        e.type = await elem.getAttribute("type");
      }

      if (tag === "p" || tag === "h1" || tag === "h2") {
        let content = await elem.getText();
        //console.log(content);
        //if (content === "") break;
        let lineHeight = parseInt(await elem.getCssValue("line-height"), 10);
        e.lines = e.height / lineHeight;
      }
      if (displayed) elements.push(e);
    }
  }
  return elements;
}

async function saveData() {
  let elems = await getElementList();
  console.log(elems);
  data.elements = elems;

  var json = JSON.stringify(data);
  fs.writeFile("data.json", json, function(err) {
    if (err) {
      console.log(err);
    }
  });
}

browser.navigate(website.url);
saveData();
