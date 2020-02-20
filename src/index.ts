import "chromedriver";
import {
  Builder,
  ThenableWebDriver,
  WebElement,
  By,
  WebElementPromise,
  promise
} from "selenium-webdriver";

const commandLineArgs = require("command-line-args");
const link1 = "https://getbootstrap.com/docs/4.4/examples/floating-labels/";
const link2 = "https://v4-alpha.getbootstrap.com/examples/album/";

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

  public constructor(private browserName: string) {
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
    var elems = await this.driver.findElements(By.css(selector));
    return elems;
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

const browser = new Browser("chrome");
browser.navigate(website.url);

for (let tag of website.tags) {
  browser.findElements(tag).then(elems => {
    promise.filter(elems, async function(elem) {
      var info = await elem.getRect().then(value => {
        return value;
      });
      console.log(tag, ":", info);
    });
  });
}
